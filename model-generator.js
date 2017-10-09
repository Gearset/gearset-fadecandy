// Org pixels
let numOrgs = 4;
let numPixelsPerOrg = 45;

let model = [];

for(var orgIndex = 0; orgIndex < numOrgsAndLogo; orgIndex++){
    for(var pixelIndex = 0; pixelIndex < numPixelsPerOrg; pixelIndex++){
        model.push({
            type: org,
            orgIndex: orgIndex,
            pixelIndex: pixelIndex
        });
    }
}

// Logo pixels
var numPixelsInLogo = 45;
for(var pixelIndex = 0; pixelIndex < numPixelsInLogo; pixelIndex++){
    model.push({
        type: logo,
        pixelIndex: pixelIndex
    });
}

let modelString = JSON.stringify(model);

console.log(modelString);
