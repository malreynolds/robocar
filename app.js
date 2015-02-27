// Define pin numbers as specified in the documentation
// -------------------------------------------------------------------------
var lmencpin = 6  //  D6 - left  motor encoder input - optional
var rmencpin = 5  //  D5 - right motor encoder input - optional

var lmbrkpin = 4  //  D4 - left  motor brake        control    pin    HIGH = Brake
var lmdirpin = 2  //  D2 - left  motor direction    control    pin    HIGH = Forward   Low = Reverse
var lmpwmpin = 3  //  D3 - left  motor pulse width  modulation pin    0 - 255          Speed and Brake
var lmcurpin = 6  //  A6 - left  motor current      monitor    pin    0 - 1023         -20A to +20A

var rmbrkpin = 9  //  D9 - right motor brake        control    pin    HIGH = Brake
var rmdirpin = 10  // D10 - right motor direction    control    pin    HIGH = Forward   Low = Reverse
var rmpwmpin = 11  // D11 - right motor pulse width  modulation pin    0 - 255          Speed and Brake
var rmcurpin = 7  //  A7 - right motor current      monitor    pin    0 - 1023         -20A to +20A

var voltspin = 3  //  A3 - battery voltage          1V = 33.57        30V = 1007
// -------------------------------------------------------------------------

// Define global board variables
var lmspd, lmbrk;
var rmspd, rmbrk;

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

  board.repl.inject({
    lm: lm,
    rm: rm
  });

  // On client connection

  var timeout;

  io.sockets.on('connection', function(socket) {
    socket.on('controlMessage', function(message) {
      secondTime = Date.now();
      diff = secondTime - firstTime
      firstTime = secondTime;
      console.log(diff);

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(function(){
        lm.stop();
        rm.stop();
      }, 100);

      if (diff > 15) {
        if (isBraking == false)
          // lm.start(message.speed + 60);
          console.log("I'm supposed to be moving now");
        console.log(message);
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
      }
    });
  })
});





