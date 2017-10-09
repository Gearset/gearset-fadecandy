const xmlParser = require('xml2js').parseString;
const states = require('./states');

function CruiseControlParser () {
    const self = this;

    function parseXml (xmlString) {
        return new Promise((fulfil, reject) => {
            xmlParser(xmlString, (err, data) => {
                if(err) {
                    reject(err);
                }
                fulfil(data);
            });
        });
    }
    
    function convertState(projectStatus, codeCovered = true) {
        switch(projectStatus) {
            case 'Success':
                return codeCovered ? states.passing : states.lowCoverage;
            case 'Failure':
                return states.failing;
            default:
                console.log("Couldn't convert cruisecontrol state", projectStatus);
                return states.unknown;
        }
    }

    self.parse = function (feedBody) {
        return parseXml(feedBody).then((parsed) => {
            var statuses = parsed.Projects.Project.map( (project) => {

                let codeCovered;
                if (project.$.lastRunCodeCoverage && project.$.lastRunCodecoverageThreshold) {
                    codeCovered = project.$.lastRunCodeCoverage >= project.$.lastRunCodecoverageThreshold;
                }
                const status = convertState(project.$.lastBuildStatus, codeCovered);

                return {
                    name: project.$.name,
                    status: status,
                    webUrl: project.$.webUrl
                }
            } );

            return statuses;
        })
    };

    return self;
}

module.exports = CruiseControlParser;
