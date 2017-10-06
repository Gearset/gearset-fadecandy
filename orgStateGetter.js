const fetch = require('node-fetch');

function OrgStateGetter (cruiseControlFeedUrl, cruiseControlParser) {
    const self = this;

    self.cruiseControlFeedUrl = cruiseControlFeedUrl;
    self.cruiseControlParser = cruiseControlParser;

    const fetchFeed = function () {
        return fetch(self.cruiseControlFeedUrl).then(res => res.text());
    };
    
    self.getParsedFeed = function () {
        return fetchFeed().then(feed => self.cruiseControlParser.parse(feed));
    };
}

module.exports = OrgStateGetter;
