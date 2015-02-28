// Define pin numbers as specified in the documentation for the controller
// -------------------------------------------------------------------------
var lmbrkpin = 4  //  D4 - left  motor brake        control    pin    HIGH = Brake
var lmdirpin = 2  //  D2 - left  motor direction    control    pin    HIGH = Forward   Low = Reverse
var lmpwmpin = 3  //  D3 - left  motor pulse width  modulation pin    0 - 255          Speed and Brake
var lmcurpin = 6  //  A6 - left  motor current      monitor    pin    0 - 1023         -20A to +20A

var rmbrkpin = 9  //  D9 - right motor brake        control    pin    HIGH = Brake
var rmdirpin = 10  // D10 - right motor direction    control    pin    HIGH = Forward   Low = Reverse
var rmpwmpin = 11  // D11 - right motor pulse width  modulation pin    0 - 255          Speed and Brake
var rmcurpin = 7  //  A7 - right motor current      monitor    pin    0 - 1023         -20A to +20A

var handservopin = 7;
var gripservopin = 8;
// -------------------------------------------------------------------------

// Define node variables
// -------------------------------------------
var express    = require("express");
var path       = require('path');
var debug      = require("debug")("robocar");
var app        = express();
var socketio   = require('socket.io');
var five       = require("johnny-five");
var board      = new five.Board();
// -------------------------------------------

// The board's pins will not be accessible until
// the board has reported that it is ready

// Set the viewing engine to jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "jade");

// Route all requests to the main page
app.get("/", function(req, res){
    res.render("index");
});

// Define where static content lives
app.use(express.static(path.join(__dirname, 'public')));

// Set the port
app.set('port', process.env.PORT || 3000);

// Start the server
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// Mount the socket.io server on top of the web server
// Communication will still happen on the same port
// http://stackoverflow.com/questions/11805130/socket-io-how-to-send-javascript-object
// Check there for more details
var io = socketio.listen(server);

var firstTime = Date.now();
var secondTime;
var diff;
var isBraking = false;

board.on("ready", function() {

  console.log("The T'Rex Motor Controller is ready!");

  var lm = new five.Motor({
    pins: {
      pwm: lmpwmpin,
      dir: lmdirpin,
      brake: lmbrkpin
    }
  });

  var rm = new five.Motor({
    pins: {
      pwm: rmpwmpin,
      dir: rmdirpin,
      brake: rmbrkpin
    }
  });

  var handServo = new five.Servo({
    pin: handservopin,
    center: true;
  })

  var gripServo = new five.Servo({
    pin: handservopin,
    center: true;
  })

  board.repl.inject({
    lm: lm,
    rm: rm,
    handServo: handServo,
    gripServo: gripServo
  });

  var timeout;

  // On client connection
  io.sockets.on('connection', function(socket) {
    socket.on('controlMessage', function(message) {
      secondTime = Date.now();
      diff = secondTime - firstTime
      firstTime = secondTime;

      // Clear the timeout every time
      if (timeout) {
        clearTimeout(timeout)
      }

      // If we don't get a message in 100 milliseconds, stop the car from moving
      timeout = setTimeout(function(){
        lm.stop();
        rm.stop();
      }, 100);

      console.log(message, diff);

      // We don't wanna process events too fast so we discard frames that are too close in time
      if (diff > 15) {
        // Handle brakes
        if (message.brake == 1 && isBraking == false) {
          isBraking = true;
          lm.brake();
          rm.brake();
          console.log("braking");
        }
        else if (message.brake == 0 && isBraking == true) {
          isBraking = false;
          lm.release();
          rm.release();
          console.log("releasing brakes");
        }

        // Handle speed and direction
        if (isBraking == false) {
          if (message.dir == true) {
          // If we're moving forward
            lm.forward(message.lmspeed);
            rm.forward(message.rmspeed);
          } else {
          // If we're moving backwards
            lm.reverse(message.lmspeed);
            rm.reverse(message.rmspeed);
          }
        }
      }
    });
  })
});





