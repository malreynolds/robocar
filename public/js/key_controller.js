$(function () {

    var speed = 128;

    var lspd, rspd, direction, brakes = 0, moving = false;

    var up    = false,
        down  = false,
        left  = false,
        right = false;

    function moveMotors() {
        // If we're going forward
        if (up) {
            // if we're going strictly forward
            if (!left && !down && !right) {
                lsdp = speed;
                rspd = speed;
                moving = true;
            // if we're going forward while turning left
            } else if (left && !down && !right) {
                lspd = 0;
                rspd = speed;
                moving = true;
            // if we're going forward while turning right
            } else if (!left && !down && right) {
                lspd = speed;
                rspd = 0;
                moving = true;
            }
            direction = true;
        // If we're going backwards
        } else if (down) {
            // if we're going strictly backwards
            if (!left && !up && !right) {
                lspd = speed;
                rspd = speed;
                moving = true;
            // if we're going backwards in a left direction
            } else if (left && !up && !right) {
                lspd = 0;
                rspd = speed;
                moving = true;
            // if we're going backwards in a right direction
            } else if (!left && !up && right) {
                lspd = speed;
                rspd = 0;
                moving = true;
            }
            direction = false;
        // if we're rotating in a left direction
        } else if (left && !up && !down && !right) {
            lspd = 0;
            rspd = speed;
            moving = true;
            direction = true;
        // if we're rotating in a right direction
        } else if (right && !left && !down && !up) {
            lspd = speed;
            rspd = 0;
            direction = true;
            moving = true;
        }
        if (moving) {
            socket.emit(dir: direction, lmspeed: lmspd, rmspeed: rmspd, brake: brakes)
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
