function gearsetParty(config, startTime) {
    const self = this;

    self.easterEggMilliSeconds = config.easterEggFlashMilliSeconds || 1000;

    self.pixelStatus = Array(...Array(45)).map(() => {
        return {
            timeSet: startTime + Math.floor(Math.random() * 2000),
            colour: [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
        };
    });

    self.Test = function() {
        console.log('writing')
    }

    self.letsGetThisPartyStarted = function (pixelIndex, millis) {
        const pixelLastSet = self.pixelStatus[pixelIndex].timeSet;
        const randomDelay = Math.floor(Math.random() * (2*self.easterEggMilliSeconds + 1) - self.easterEggMilliSeconds);
        if ((millis - pixelLastSet + randomDelay) >= self.easterEggMilliSeconds) {
            const red = Math.floor(Math.random() * 256);
            const green = Math.floor(Math.random() * 256);
            const blue = Math.floor(Math.random() * 256);
            self.pixelStatus[pixelIndex].timeSet = millis;
            self.pixelStatus[pixelIndex].colour = [red, green, blue];
        }
        return self.pixelStatus[pixelIndex].colour;
    }

    return self;   
}

module.exports = gearsetParty;