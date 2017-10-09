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
                if (codeCovered) return states.passing;
                else return states.lowCoverage;
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
                let projectStatus = {
                    name: project.$.name,
                    webUrl: project.$.webUrl
                }

                if (project.$.lastRunCodeCoverage && project.$.lastRunCodecoverageThreshold) {
                    projectStatus.codeCovered = project.$.lastRunCodeCoverage >= project.$.lastRunCodecoverageThreshold;
                }

                projectStatus.status = convertState(project.$.lastBuildStatus, projectStatus.codeCovered);

                return projectStatus;
            } );

            return statuses;
        })
    };

    return self;
}

module.exports = CruiseControlParser;
