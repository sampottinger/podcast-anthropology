function CoocurranceMatrix () {

    // Private vars
    var counts;

    // Method declarations
    var getGini = function (topic1, topic2) {
        var sum1 = getPairSize(topic1, topic1);
        var sum2 = getPairSize(topic2, topic2);
        var overlap = getPairSize(topic1, topic2);
        return sum1 === 0 || sum2 === 0 ? 0 : overlap / (sum1 + sum2);
    };

    var processEpisode = function (episodeGraphic) {
        var topics = episodeGraphic.getEpisode().getTopics();
        topics.forEach(function (topic1) {
            topics.forEach(function (topic2) {
                if (topic1 <= topic2) {
                    var pairKey = createPairKey(topic1, topic2);  
                    
                    if (!counts.has(pairKey)) {
                        counts.set(pairKey, []);
                    }

                    counts.get(pairKey).push(episodeGraphic);
                }
            });
        });
    };

    var getPairSize = function (topic1, topic2) {
        var episodes = getPair(topic1, topic2);
        return episodes === null ? 0 : episodes.length;
    };

    var getPair = function (topic1, topic2) {
        var pairKey = createPairKey(topic1, topic2);
        if (counts.has(pairKey)) {
            return counts.get(pairKey);
        } else {
            return null;
        }
    };

    var createPairKey = function (topic1, topic2) {
        if (topic1 < topic2) {
            return topic1 + " " + topic2;
        } else {
            return topic2 + " " + topic1;
        }
    };

    // Init
    counts = dict();

    // Attach public members
    this.getGini = getGini;
    this.processEpisode = processEpisode;
    this.getPairSize = getPairSize;
    this.getPair = getPair;
}
