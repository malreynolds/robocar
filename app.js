var express    = require("express");
var path       = require('path');
var debug      = require("debug")("robocar");
var app        = express();
var socketio   = require('socket.io');
var i2c        = require('i2c');
var i2caddress = 0x07;
var i2cstart   = 0x0F;
var pwmfreq    = 6;
var wire       = new i2c(0x07, {device: '/dev/i2c-1'});

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

// On client connection
var breakFlag = true;
var command = new Int8Array(27);
io.sockets.on('connection', function(socket) {
    socket.on('controlMessage', function(message) {
        command[0] = i2cstart;
        command[1] = pwmfreq;
        command[2] = 0;
        command[3] = message.speed;
        command[4] = message.breaks;
        command[5] = 0;
        command[6] = message.speed;
        command[7] = message.breaks;
        command[8] = 0;
        command[9] = 0;
        command[10] = 0;
        command[11] = 0;
        command[12] = 0;
        command[13] = 0;
        command[14] = 0;
        command[15] = 0;
        command[16] = 0;
        command[17] = 0;
        command[18] = 0;
        command[19] = 0;
        command[20] = 50;
        command[21] = 0
        command[22] = 50
        command[23] = 0;
        command[24] = 250;
        command[25] = i2caddress;
        command[26] = 0;
	console.log("Sending i2c command" + String.fromCharCode.apply(null, command));
    });
})

wire.stream(command, 27, 10);
