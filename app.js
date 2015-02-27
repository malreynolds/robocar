var express    = require("express");
var path       = require('path');
var debug      = require("debug")("robocar");
var app        = express();
var socketio   = require('socket.io');
var five       = require("johnny-five"),
var board      = new five.Board();

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

var count = 0;
var firstTime = Date.now();
var secondTime;
var diff;

// On client connection
io.sockets.on('connection', function(socket) {
    socket.on('controlMessage', function(message) {
        secondTime = Date.now();
	diff = secondTime - firstTime
	firstTime = secondTime;
	console.log(diff);
	if (diff > 15) {
		console.log("good");
      	}
    });
})

