#!/usr/bin/env node
const OPC = require('./opc');
const _ = require('underscore');
const fs = require("fs");
const parser = require("./cruiseControlParser");
const stateGetter = require("./orgStateGetter");
const stateToColourMapping = require('./stateToColourMapping');

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const feedUrl = config.feedUrl;

let orgStates = [];

function setOrgState(orgIndex, state) {
    orgStates[orgIndex] = state;
}

function getOrgState(orgIndex) {
    return orgStates[orgIndex];
}

function draw() {
    client.mapPixels(modelPoint => {
        let orgState = getOrgState(modelPoint.orgIndex)
        return stateToColourMapping.getOrgColour(orgState);
    }, model);
}

setInterval(draw, 20);

var getter = new stateGetter(feedUrl, parser());

console.log("Getting feed statuses");
getter.getParsedFeed().then(
    (projectsJson) => { 
        console.log("Got feed statuses", projectsJson);
        orgStates = _.first(projectsJson, 4).map( (project) => project.status );
    }
);
