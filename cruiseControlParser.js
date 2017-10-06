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
            console.log(parsed);
            return parsed;
        })
    };
}

module.exports = CruiseControlParser;
