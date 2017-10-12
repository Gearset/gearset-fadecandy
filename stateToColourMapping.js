const states = require('./states');

const black = [0, 0, 0];
const white = [255, 255, 255];
const red = [255, 0, 0];
const green = [0, 255, 0];
const yellow = [255, 255, 0]; 

const stateColours = {};
stateColours[states.passing] = green;
stateColours[states.lowCoverage] = yellow;
stateColours[states.failing] = red;
stateColours[states.unknown] = white;

function getOrgColour(orgState){
    let orgColour = stateColours[orgState];
    return orgColour || stateColours[states.unknown];
}

module.exports = {
    getOrgColour: getOrgColour
};