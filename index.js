#!/usr/bin/env node
const OPC = require('./opc');
const _ = require('underscore');
const fs = require("fs");
const parser = require("./cruiseControlParser");
const stateGetter = require("./orgStateGetter");
const stateToColourMapping = require('./stateToColourMapping');
const states = require('./states');

const defaultPollingPeriod = 1000 * 60 * 2; // 2 minutes

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const feedUrl = config.feedUrl;
const projectUrls = config.projectUrls;
const pollingPeriodMillis = config.pollingPeriodMillis || defaultPollingPeriod;

if(!projectUrls){
    console.error("No project URLS defined in config.json");
}

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

function updateOrgStates() {
    console.log("Getting feed statuses for", projectUrls);
    return getter.getParsedFeed().then(
        (projectsJson) => { 
            console.log("Got feed statuses");
    
            orgStates = _.map(projectUrls, projectUrl => {
                let projectStatus = _.find(projectsJson, x => x.webUrl === projectUrl);
    
                if(!projectStatus) {
                    console.log("No project status returned for project with URL", projectUrl);
                    return states.unknown;
                }
    
                return projectStatus.status;
            });
    
            console.log("Set org states to", orgStates);
        }
    );
}

updateOrgStates();
setInterval(updateOrgStates, pollingPeriodMillis)
