$(function () {
    var radToDeg = 180 / Math.PI;

    var palmMode = false;

    var controller = new Leap.Controller({
        enableGestures: true,
        frameEventName: 'animationFrame',
    });

    controller.connect();
    controller.setBackground(true);

    controller.on('ready', function() {
        $('#readyFlag').text("ready. Service version: " + controller.connection.protocol.serviceVersion);
    });

    var timeout;

    setInterval(function() {
        if (moving) {
            socket.emit("controlMessage", {dir: direction, lmspeed: lmspd, rmspeed: rmspd, brake: brakes});
            moving = false;
        }
    }, 20);

    controller.on('animationFrame', function(frame) {
        if (frame.valid && frame.hands.length > 0) {

            frame.gestures.forEach(function(gesture) {
                var handId = gesture.handIds[0];
                var type = frame.hand(handId).type;
                if (type == "left" && gesture.type == "keyTap") {
                    palmMode = !palmMode;
                }
            });

            var hand   = frame.hands[0],
                brkVal = hand.grabStrength,
                handX  = hand.palmPosition[0],
                handZ  = hand.palmPosition[2],
                dirVal = Math.atan2(-handZ, handX) * radToDeg,
                spdVal = (Math.abs(handX) > Math.abs(handZ)) ? Math.abs(handX) : Math.abs(handZ);

            moving = true;

            // Normalize direction
            if (dirVal < 0)
                dirVal += 360;

            // Normalize speed value
            if (spdVal < 20) spdVal = 0;
            else {
                spdVal += 50;
                if (spdVal > 255) spdVal = 255;
            }

            if (dirVal >= 90 && dirVal <= 180) {
                // If going left, reduce speed of left motor
                rmspd = spdVal;
                lmspd = spdVal - ((dirVal - 90) / 90) * spdVal;
            } else if (dirVal >= 0 && dirVal <= 90) {
                // If going right, reduce speed of right motor
                rmspd = spdVal - ((90 - dirVal) / 90) * spdVal;
                lmspd = spdVal;
            } else if (dirVal >= 180 && dirVal <= 270) {
                // If going left backwards, reduce speed of left motor
                rmspd = spdVal;
                lmspd = spdVal - ((270 - dirVal) / 90) * spdVal;
            } else {
                // If going right backwards, reduce speed of right motor
                rmspd = spdVal - ((dirVal - 270) / 90) * spdVal;
                lmspd = spdVal;
            }

            direction = handZ < 0
            brakes = (brkVal > 0.9 ? true : false)

            // Update the browser client values
            directionmeter.set(dirVal <= 270 ? 270 - dirVal : 360 - (dirVal - 270));
            speedmeter.set((spdVal / 255) * 100);
            $('#modeValue').text(palmMode ? "Hand Angle" :"Hand Position");
            $('#brakeValue').text(brakes);
            $('#directionValue').text(dirVal.toPrecision(3));
            $('#speedValue').text(spdVal.toPrecision(3));
        }
    })


    controller.on('connect', function() {
        $('#connectedFlag').text("Connected with protocol v" + controller.connection.opts.requestProtocolVersion);
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
});
