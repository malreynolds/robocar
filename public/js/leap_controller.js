window.onload = function () {

    var radToDeg = 180 / Math.PI;
    var controller = new Leap.Controller({
        enableGestures: true,
        frameEventName: 'animationFrame',
    });
    var socket = io.connect('http://192.168.1.75:3000');

    controller.connect();
    controller.setBackground(true);


    controller.on('ready', function() {
        $('#readyFlag').text("ready. Service version: " + controller.connection.protocol.serviceVersion);
    });
    controller.on('connect', function() {
        $('#connectedFlag').text("Connected with protocol v" + controller.connection.opts.requestProtocolVersion);
    setInterval(function() {
//    controller.on('animationFrame', function(frame) {
	var frame = controller.frame()
        if (frame.valid && frame.hands[0]){
            var hand   = frame.hands[0],
                brkVal = hand.grabStrength,
                handX  = hand.palmPosition[0],
                handZ  = hand.palmPosition[2],
                dirVal = Math.atan2(-handZ, handX) * radToDeg,
                spdVal = -handZ;

            // Normalize direction
            if (dirVal < 0)
                dirVal += 360;

            // Normalize break to binary 1 or 0
            brkVal = (brkVal > 0.9 ? 1 : 0);

            // Send values to the server. Use emit for now, but change to send later in case
            // it happens to be more efficient
            socket.emit("controlMessage", {speed: spdVal, direction: dirVal, breaks: brkVal});

            // Update the browser client values
            directionmeter.set(dirVal <= 270 ? 270 - dirVal : 360 - (dirVal - 270));
            speedmeter.set((Math.abs(spdVal) / 255) * 100);
            $('#breakValue').text(brkVal.toPrecision(3));
            $('#directionValue').text(dirVal.toPrecision(3));
            $('#speedValue').text(spdVal.toPrecision(3));
        }
    }, 20);
    });
    controller.on('disconnect', function() {
        $('#connectedFlag').text("Disconnected");
    });
    controller.on('focus', function() {
        $('#focusedFlag').text("Focused");
    });
    controller.on('blur', function() {
        $('#focusedFlag').text("Not focused");
    });
    controller.on('deviceAttached', function(deviceInfo) {
        $('#attachedFlag').text("Device is attached.");
    });
    controller.on('deviceRemoved', function(deviceInfo) {
        $('#attachedFlag').text("Device is removed.");
    });
    controller.on('streamingStarted', function(deviceInfo) {
        $('#streamingFlag').text("Streaming started.");
    });
    controller.on('streamingStopped', function(deviceInfo) {
        $('#streamingFlag').text("Streaming stopped.");
    });
}
