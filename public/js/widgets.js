var directionmeter = Raphael('dcanvas').tachometer(180, {
    number: false,
    scaleAngleStart: 0,
    scaleAngleEnd: 360,
    numberMin: 0,
    numberMax: 360,
    needleAnimation: false,
    interactive: true
});

var speedmeter = Raphael('scanvas').tachometer(0, {
    number: true,
    scaleAngleStart: 70,
    scaleAngleEnd: 290,
    numberMin: 0,
    numberMax: 100,
    needleAnimation: false,
    interactive: true
});
