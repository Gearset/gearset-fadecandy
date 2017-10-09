#!/usr/bin/env node
const OPC = require('./opc');
const _ = require('underscore');
const fs = require("fs");
const parser = require("./cruiseControlParser");
const stateGetter = require("./orgStateGetter");
const stateToColourMapping = require('./stateToColourMapping');
const states = require('./states');

const defaultPollingPeriod = 1000 * 60 * 2; // 2 minutes
const logoOrange = [247, 147, 17];

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const feedUrl = config.feedUrl;
const projectUrls = config.projectUrls;
let pollingPeriodMillis = config.pollingPeriodMillis || defaultPollingPeriod;

if(!projectUrls){
    console.error("No project URLS defined in config.json");
}
if(pollingPeriodMillis < 5000) {
    console.error("Polling period of less than 5 seconds is not permitted, setting to default of " + defaultPollingPeriod);
    pollingPeriodMillis = defaultPollingPeriod;
}

let orgStates = [];

function getOrgState(orgIndex) {
    return orgStates[orgIndex];
}

function draw() {
    const millis = new Date().getTime();

    client.mapPixels(modelPoint => {
        if (modelPoint.type === "logo") {
            return logoOrange;
        }

        let orgState = getOrgState(modelPoint.orgIndex);
        if (orgState === "passing") {
            return stateToColourMapping.getOrgColour(orgState);
        }

        let [red, green, blue] = stateToColourMapping.getOrgColour(orgState);
        const modulation = 0.5 * (Math.sin(millis * 0.00628 * 0.5) + 1);
        const minColour = 25;
        red = (red === 0) ? 0 : minColour + (red - minColour) * modulation;
        green = (green === 0) ? 0 : minColour + (green - minColour) * modulation;
        blue = (blue === 0) ? 0 : minColour + (blue - minColour) * modulation;

        return [red, green, blue];
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
