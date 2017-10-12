const stateToColourMapping = require('./stateToColourMapping');

function drawOrgs(orgState, millis) {
    if (orgState === "passing") {
        return stateToColourMapping.getOrgColour(orgState);
    }

    let [red, green, blue] = stateToColourMapping.getOrgColour(orgState);
    const amplitude = 0.5 * (Math.sin(millis * 0.00628 * 0.5) + 1);
    const minColour = 25;
    red = (red === 0) ? 0 : minColour + (red - minColour) * amplitude;
    green = (green === 0) ? 0 : minColour + (green - minColour) * amplitude;
    blue = (blue === 0) ? 0 : minColour + (blue - minColour) * amplitude;

    return [red, green, blue];

}

module.exports = drawOrgs;