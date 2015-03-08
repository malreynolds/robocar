var socket = io.connect('http://' + window.location.hostname + ':3000');
var rmspd, lmspd, direction, brakes, moving = false;
