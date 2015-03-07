init();

function init() {
    if (window.DeviceOrientationEvent) {

        window.addEventListener('deviceorientation', function(data) {
            // gamma gives us turn (left/rights)
            var turn = data.gamma;

            // beta gives us the direction (forward/reverse)
            var direction = data.beta;

            // call our orientation event handler
            deviceOrientationHandler(turn, direction);
            // Show a message to the user if the device is unsupported
            // document.getElementById("doEvent").innerHTML = "Robocar is not supported on your mobile device/browser.";
       })
    }

function deviceOrientationHandler(turn, direction) {
    document.getElementById("turn").innerHTML = Math.round(turn);
    document.getElementById("direction").innerHTML = Math.round(direction);
}

