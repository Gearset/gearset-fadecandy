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
const white = [128, 128, 128];
const red = [128, 0, 0];
const green = [0, 128, 0];

const states = {
    passing: 'passing',
    failing: 'failing',
    unknown: 'unknown'
}

const stateColours = {};
stateColours[states.passing] = green;
stateColours[states.failing] = red;
stateColours[states.unknown] = white;

let orgStates = [];

function setOrgState(orgIndex, state) {
    orgStates[orgIndex] = state;
}

function getOrgColour(orgIndex){
    let orgState = orgStates[orgIndex];
    let orgColour = stateColours[orgState];
    return orgColour || stateColours[states.unknown];
}

function convertState(projectStatus) {
    switch(projectStatus) {
        case 'Success':
            return states.passing;
        case 'Failure':
            return states.failing;
        default:
            return states.unknown;
    }
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
        orgStates = _.first(projectsJson, 4).map( (project) => convertState(project.status) );
    }
);
