const fs = require("fs");

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const easterEggMilliSeconds = config.easterEggFlashMilliSeconds || 1000;

let startTime = new Date().getTime();

let pixelStatus = Array(...Array(45)).map(() => {
    return {
        timeSet: startTime + Math.floor(Math.random() * 2000),
        colour: [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
    };
});

function gearsetParty(pixelIndex) {
    const millis = new Date().getTime();;
    const pixelLastSet = pixelStatus[pixelIndex].timeSet;
    const randomDelay = Math.floor(Math.random() * (2*easterEggMilliSeconds + 1) - easterEggMilliSeconds);
    if ((millis - pixelLastSet + randomDelay) >= easterEggMilliSeconds) {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        pixelStatus[pixelIndex].timeSet = millis;
        pixelStatus[pixelIndex].colour = [red, green, blue];
    }
    return pixelStatus[pixelIndex].colour;
}

module.exports = gearsetParty;