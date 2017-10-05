#!/usr/bin/env node

const OPC = require('./opc');
const _ = require('underscore');

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const black = [0, 0, 0];
const red = [128, 0, 0];
const green = [0, 128, 0];

const states = {
    passing: 'passing',
    failing: 'failing'
}

const stateColours = {};
stateColours[states.passing] = green;
stateColours[states.failing] = red;

let orgStates = [
    states.passing,
    states.failing,
    states.failing,
    states.passing
];

function setOrgState(orgIndex, state) {
    orgStates[orgIndex] = state;
}

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

setInterval(() => {
    orgStates = _.map(orgStates, () => {
        return Math.random() > 0.3 ? states.passing : states.failing;
    });
}, 5000);
