#!/usr/bin/env node
const parser = require("./cruiseControlParser");
const stateGetter = require("./orgStateGetter");
const OPC = require('./opc');
const _ = require('underscore');
const fs = require("fs");

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const feedUrl = config.feedUrl;

const black = [0, 0, 0];
const red = [128, 0, 0];
const green = [0, 128, 0];

const states = {
    Passing: 'Passing',
    Failing: 'Failing'
}

const stateColours = {};
stateColours[states.Passing] = green;
stateColours[states.Failing] = red;

let orgStates = [
    states.Passing,
    states.Failing,
    states.Failing,
    states.Passing
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

var getter = new stateGetter(feedUrl, parser());

getter.getParsedFeed().then(
    (projectsJson) => { 
        orgStates = _.first(projectsJson, 4).map( (project) => project.status );
    }
);
