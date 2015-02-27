var tachometer = Raphael('canvas').tachometer(180, {
    number: true,
    scaleAngleStart: 0,
    scaleAngleEnd: 360,
    numberMin: 0,
    numberMax: 360,
    needleAnimationDuration: 5,
    needleAnimationEasing: "linear",
    interactive: true
});
