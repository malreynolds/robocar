$(function () {

    var lmspd, rmspd, speed, direction, steerVal, moving = false, brakes = false;

    init();

    setInterval(function() {
        if (moving)
            socket.emit("controlMessage", {dir: direction, lmspeed: lmspd, rmspeed: rmspd, brake: brakes});
    }, 20);

    function init() {
        if (window.DeviceOrientationEvent) {

            window.addEventListener('deviceorientation', function(data) {
                // gamma gives us turn (left/rights)
                var steer = data.gamma;

                // beta gives us the direction (forward/reverse)
                var throttle = data.beta;

                // call our orientation event handler
                deviceOrientationHandler(steer, throttle);
           });
        }
    }

    function deviceOrientationHandler(steer, throttle) {
        // For small values of throttle we don't account for speed
        if (Math.abs(throttle) < 5) {
            speed = 0;
            moving = false
        // Also since we don't want the users to tilt too much we limit the max value
        } else if (Math.abs(throttle > 20)) {
            speed = 20;
            moving = true;
        } else {
            moving = true;
        }


        // Normalize speed values
        speed = speed * 10 + 32;

        // Get the direction
        direction = (throttle > 0) ? false : true;

        // For small values of steering we don't account for steering
        if (Math.abs(steer) < 5) {
            rmspd = lmspd = speed;
            return;
        } else if (Math.abs(steer) > 20) {
            steerVal = 20;
        }

        // In the range of (0...20) we can reduce the speed several times
        var reduce_factor = speed / 20;

        // Steering left
        if (steer < 0) {
            lmspd = parseInt(speed - steerVal * reduce_factor);
            rmspd = speed;
        } else {
            lmspd = speed;
            rmspd = parseInt(speed - steerVal * reduce_factor);
        }

        document.getElementById("steer").innerHTML = Math.round(steer);
        document.getElementById("throttle").innerHTML = Math.round(throttle);
    }
});
