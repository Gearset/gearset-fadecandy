#!/usr/bin/env node

var OPC = require('./opc')
var client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
var model = OPC.loadModel(__dirname + '/model.json');
const _ = require('underscore');

let black = [0, 0, 0];
let red = [128, 0, 0];
let green = [0, 128, 0];

let states = {
    passing: 'passing',
    failing: 'failing'
}

let stateColours = {};
stateColours[states.passing] = green;
stateColours[states.failing] = red;

let orgStates = [
    states.passing,
    states.failing,
    states.failing,
    states.passing
];

function getOrgColour(orgIndex){
    let orgState = orgStates[orgIndex];
    let orgColour = stateColours[orgState];
    return orgColour;
}

function draw() {
    client.mapPixels(modelPoint => {
        return getOrgColour(modelPoint.orgIndex);
    }, model);
}

setInterval(draw, 20);
