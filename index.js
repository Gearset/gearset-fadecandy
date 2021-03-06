#!/usr/bin/env node
const OPC = require('./opc');
const _ = require('underscore');
const fs = require("fs");
const parser = require("./cruiseControlParser");
const stateGetter = require("./orgStateGetter");
const states = require('./states');
const gearsetParty = require('./gearsetParty');
const drawOrgs = require('./drawOrgs');

const defaultPollingPeriod = 1000 * 60 * 2; // 2 minutes
const logoOrange = [247, 147, 17];

const client = new OPC(process.env.FADECANDY_SERVER || 'localhost', 7890);
const model = OPC.loadModel(__dirname + '/model.json');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const feedUrl = config.feedUrl;
const projectUrls = config.projectUrls;
let pollingPeriodMillis = config.pollingPeriodMillis || defaultPollingPeriod;
const easterEggName = config.projectNameForEasterEgg || "Gearset is awesome";

if(!projectUrls){
    console.error("No project URLS defined in config.json");
}
if(pollingPeriodMillis < 5000) {
    console.error("Polling period of less than 5 seconds is not permitted, setting to default of " + defaultPollingPeriod);
    pollingPeriodMillis = defaultPollingPeriod;
}

let orgStates = [];

function getOrgState(orgIndex) {
    return orgStates[orgIndex] ? orgStates[orgIndex].status : states.unknown;
}

function getOrgName(orgIndex) {
    return orgStates[orgIndex] ? orgStates[orgIndex].name : "unknown";
}

var partyTime = new gearsetParty(config, new Date().getTime());

function draw() {
    const millis = new Date().getTime();

    client.mapPixels(modelPoint => {
        if (modelPoint.type === "logo") {
            return logoOrange;
        }

        const orgState = getOrgState(modelPoint.orgIndex);
        const orgName = getOrgName(modelPoint.orgIndex)

        if (orgName === easterEggName) {
            return partyTime.letsGetThisPartyStarted(modelPoint.pixelIndex, millis);
        }

        return drawOrgs(orgState, millis);
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
                    return {
                        name: "unknown",
                        status: states.unknown
                    };
                }

                return {
                    name: projectStatus.name,
                    status: projectStatus.status
                };
            });

            console.log("Set org states to", orgStates.map(state => state.status));
        }
    );
}

updateOrgStates();
setInterval(updateOrgStates, pollingPeriodMillis)
