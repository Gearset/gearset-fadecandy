#!/usr/bin/env node

var OPC = require('./opc')
var client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
var model = OPC.loadModel(__dirname + '/model.json');

let orgStates = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 255]
]

let black = [0, 0, 0];

function draw() {
    var periods = Math.floor(new Date().getTime() / 100);

    client.mapPixels(modelPoint => {
        if((modelPoint.pixelIndex + periods) % 4 === 0){
            return black;
        } else{
            return orgStates[modelPoint.orgIndex];
        }
    }, model);
}

setInterval(draw, 20);
