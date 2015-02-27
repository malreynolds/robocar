// Define pin numbers as specified in the documentation
// -------------------------------------------------------------------------
var lmencpin     6  //  D6 - left  motor encoder input - optional
var rmencpin     5  //  D5 - right motor encoder input - optional

var lmbrkpin     4  //  D4 - left  motor brake        control    pin    HIGH = Brake
var lmdirpin     2  //  D2 - left  motor direction    control    pin    HIGH = Forward   Low = Reverse
var lmpwmpin     3  //  D3 - left  motor pulse width  modulation pin    0 - 255          Speed and Brake
var lmcurpin     6  //  A6 - left  motor current      monitor    pin    0 - 1023         -20A to +20A

var rmbrkpin     9  //  D9 - right motor brake        control    pin    HIGH = Brake
var rmdirpin    10  // D10 - right motor direction    control    pin    HIGH = Forward   Low = Reverse
var rmpwmpin    11  // D11 - right motor pulse width  modulation pin    0 - 255          Speed and Brake
var rmcurpin     7  //  A7 - right motor current      monitor    pin    0 - 1023         -20A to +20A

var voltspin     3  //  A3 - battery voltage          1V = 33.57        30V = 1007
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
var five       = require("johnny-five"),
var board      = new five.Board();
// -------------------------------------------

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {
  console.log("The T'rex Motor Controller is ready!");

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

  lm.on("forward", function(err, timestamp) {
    // demonstrate braking after 5 seconds
    board.wait(5000, function() {
      lm.brake();
    });
  });

  lm.on("brake", function(err, timestamp) {
    // Release the brake after .1 seconds
    board.wait(100, function() {
      lm.stop();
    });
  });



    rm.on("forward", function(err, timestamp) {
    // demonstrate braking after 5 seconds
    board.wait(5000, function() {
      rm.brake();
    });
  });

  rm.on("brake", function(err, timestamp) {
    // Release the brake after .1 seconds
    board.wait(100, function() {
      rm.stop();
    });
  });

  // Start the motors at half speed
  lm.forward(128);
  rm.forward(128);

  // pinMode(lmpwmpin,OUTPUT);                            // configure left  motor PWM       pin for output
  // pinMode(lmdirpin,OUTPUT);                            // configure left  motor direction pin for output
  // pinMode(lmbrkpin,OUTPUT);                            // configure left  motor brake     pin for output

  // pinMode(rmpwmpin,OUTPUT);                            // configure right motor PWM       pin for output
  // pinMode(rmdirpin,OUTPUT);                            // configure right motor direction pin for output
  // pinMode(rmbrkpin,OUTPUT);                            // configure right motor brake     pin for output
});

// // Set the viewing engine to jade
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', "jade");

// // Route all requests to the main page
// app.get("/", function(req, res){
//     res.render("index");
// });

// // Define where static content lives
// app.use(express.static(path.join(__dirname, 'public')));

// // Set the port
// app.set('port', process.env.PORT || 3000);

// // Start the server
// var server = app.listen(app.get('port'), function() {
//   debug('Express server listening on port ' + server.address().port);
// });

// // Mount the socket.io server on top of the web server
// // Communication will still happen on the same port
// // http://stackoverflow.com/questions/11805130/socket-io-how-to-send-javascript-object
// // Check there for more details
// var io = socketio.listen(server);

// var count = 0;
// var firstTime = Date.now();
// var secondTime;
// var diff;

// // On client connection
// io.sockets.on('connection', function(socket) {
//   socket.on('controlMessage', function(message) {
//     secondTime = Date.now();
// 	  diff = secondTime - firstTime
// 	  firstTime = secondTime;
// 	  console.log(diff);
//     if (diff > 15) {
//       console.log("good");
//     }
//   });
// })

