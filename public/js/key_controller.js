$(function () {

    var spdVal = 128;

    var lspd, rspd, direction, brakes = 0, moving = false, dirVal;

    var up    = false,
        down  = false,
        left  = false,
        right = false;

    function moveMotors() {
        // If we're going forward
        if (up) {
            // if we're going strictly forward
            if (!left && !down && !right) {
                lsdp = spdVal;
                rspd = spdVal;
                moving = true;
                dirVal = 90;
            // if we're going forward while turning left
            } else if (left && !down && !right) {
                lspd = 0;
                rspd = spdVal;
                moving = true;
                dirVal = 180;
            // if we're going forward while turning right
            } else if (!left && !down && right) {
                lspd = spdVal;
                rspd = 0;
                moving = true;
                dirVal = 0;
            }
            direction = true;
        // If we're going backwards
        } else if (down) {
            // if we're going strictly backwards
            if (!left && !up && !right) {
                lspd = spdVal;
                rspd = spdVal;
                moving = true;
                dirVal = 270;
            // if we're going backwards in a left direction
            } else if (left && !up && !right) {
                lspd = 0;
                rspd = spdVal;
                moving = true;
                dirVal = 180;
            // if we're going backwards in a right direction
            } else if (!left && !up && right) {
                lspd = spdVal;
                rspd = 0;
                moving = true;
                dirVal = 0;
            }
            direction = false;
        // if we're rotating in a left direction
        } else if (left && !up && !down && !right) {
            lspd = 0;
            rspd = spdVal;
            moving = true;
            dirVal = 180;
            direction = true;
        // if we're rotating in a right direction
        } else if (right && !left && !down && !up) {
            lspd = spdVal;
            rspd = 0;
            dirVal = 0;
            direction = true;
            moving = true;
        }
        if (moving) {
            socket.emit("controlMessage", {dir: direction, lmspdVal: lspd, rmspdVal: rspd, brake: brakes});
            // Update the browser client values
            directionmeter.set(dirVal <= 270 ? 270 - dirVal : 360 - (dirVal - 270));
            speedmeter.set((spdVal / 255) * 100);
            $('#brakeValue').text(brkVal.toPrecision(3));
            $('#directionValue').text(dirVal.toPrecision(3));
            $('#spdValValue').text(spdVal.toPrecision(3));
            moving = false;
        }
    }

    $(document).keydown(function(e){
        switch(e.which){
        case 87:
            if(up) return;
            up = true;
            $('.up').addClass('active');
            break;
        case 65:
            if(left) return;
            left = true;
            $('.left').addClass('active');
            break;
        case 83:
            if(down) return;
            down = true;
            $('.down').addClass('active');
            break;
        case 68:
            if(right) return;
            right = true;
            $('.right').addClass('active');
            break;
    }
    moveMotors();
  });

  $(document).keyup(function(e){
    switch(e.which){
        case 87:
            if(!up) return;
            up = false;
            $('.up').removeClass('active');
            break;
        case 65:
            if(!left) return;
            left = false;
            $('.left').removeClass('active');
            break;
        case 83:
            if(!down) return;
            down = false;
            $('.down').removeClass('active');
            break;
        case 68:
            if(!right) return;
            right = false;
            $('.right').removeClass('active');
            break;
    }
    moveMotors();
  });
});
