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
    
    function convertState(projectStatus) {
        switch(projectStatus) {
            case 'Success':
                return states.passing;
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
                let status = {
                    name: project.$.name,
                    status: convertState(project.$.lastBuildStatus),
                    webUrl: project.$.webUrl
                }

                if (project.$.lastRunCodeCoverage && project.$.lastRunCodecoverageThreshold) {
                    status[codeCovered] = project.$.lastRunCodeCoverage >= project.$.lastRunCodecoverageThreshold;
                }

                return status;
            } );

            return statuses;
        })
    };

    return self;
}

module.exports = CruiseControlParser;
