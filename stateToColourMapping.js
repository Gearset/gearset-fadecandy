const states = require('./states');

const black = [0, 0, 0];
const white = [128, 128, 128];
const red = [128, 0, 0];
const green = [0, 128, 0];
const orange = [247, 147, 17];
const yellow = [128, 128, 0]; 

const stateColours = {};
stateColours[states.passing] = green;
stateColours[states.lowCoverage] = yellow;
stateColours[states.failing] = red;
stateColours[states.unknown] = white;

function getOrgColour(orgState){
    if (orgState === "gearsetLogo") return orange;
    let orgColour = stateColours[orgState];
    return orgColour || stateColours[states.unknown];
}

module.exports = {
    getOrgColour: getOrgColour
};