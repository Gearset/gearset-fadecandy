const xmlParser = require('xml2js').parseString;

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

    self.parse = function (feedBody) {
        return parseXml(feedBody).then((parsed) => {
            var statuses = parsed.Projects.Project.map( (project) => {
                return {
                    name: project.$.name,
                    status: project.$.lastBuildStatus
                }
            } );

            return statuses;
        })
    };

    return self;
}

module.exports = CruiseControlParser;
