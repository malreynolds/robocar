var directionmeter = Raphael('dcanvas').tachometer(180, {
    number: true,
    scaleAngleStart: 0,
    scaleAngleEnd: 360,
    numberMin: 0,
    numberMax: 360,
    needleAnimation: false,
    interactive: true
});

var directionmeter = Raphael('scanvas').tachometer(0, {
    number: true,
    scaleAngleStart: 180,
    scaleAngleEnd: 180,
    numberMin: 0,
    numberMax: 100,
    needleAnimation: false,
    interactive: true
});
