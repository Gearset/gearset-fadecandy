let numOrgsAndLogo = 4 + 1;
let numPixelsPerOrg = 45;

let model = [];

for(var orgIndex = 0; orgIndex < numOrgsAndLogo; orgIndex++){
    for(var pixelIndex = 0; pixelIndex < numPixelsPerOrg; pixelIndex++){
        model.push({
            orgIndex: orgIndex,
            pixelIndex: pixelIndex
        });
    }
}

let modelString = JSON.stringify(model);

console.log(modelString);
