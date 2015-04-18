/**
 * Adjacency matrix for storing topic co-ocurrance data.
 *
 * @author Sam Pottiner
 * @license MIT License
 */


/**
 * Simple adjacency matrix for topic co-ocurrance data.
 *
 * Object describing an adjacency matrix for an undirected graph where the edges
 * are topics and the weighted edges describe the number of episodes where two
 * topics both appear.
 *
 * @constructor
 */
function CoocurranceMatrix() {

    // -- Private vars --
    var counts;

    // -- Method declarations --

    /**
     * Get the Jaccard Index between two topics.
     *
     * @param {String} topic1 - The name of the first topic for which the
     *      overlapping set Jaccard Index is required.
     * @param {String} topic2 - The name of the second topic for which the
     *      overlapping set Jaccard Index is required.
     * @return {Number} The Jaccard Index between the two provided topics.
     */
    var getJaccard = function(topic1, topic2) {
        var sum1 = getPairSize(topic1, topic1);
        var sum2 = getPairSize(topic2, topic2);
        var overlap = getPairSize(topic1, topic2);
        return sum1 === 0 || sum2 === 0 ? 0 : overlap / (sum1 + sum2);
    };

    /**
     * Add the topics from an episode into this matrix.
     *
     * Process an episode, taking its topics and adding them to the list
     * matrix or, if they already appear in the matrix incrementing their
     * counts.
     *
     * @param {EpisodeGraphic} episodeGraphic - The episode to add to this
     *      matrix.
     */
    var processEpisode = function(episodeGraphic) {
        var topics = episodeGraphic.getEpisode().getTopics();
        topics.forEach(function(topic1) {
            topics.forEach(function(topic2) {
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

    /**
     * Get the cardinality of the intersection between two topics.
     *
     * Get the size of the if the intersection between the set of episodes
     * which include topic1 and the set of episodes that include topic2.
     *
     * @param {String} topic1 - The topic for the first set of episodes.
     * @param {String} topic2 - The topic for the second set of episodes.
     * @return {Number} The cardinality of the intersection between these two
     *      sets.
     */
    var getPairSize = function(topic1, topic2) {
        var episodes = getPair(topic1, topic2);
        return episodes === null ? 0 : episodes.length;
    };

    /**
     * Get the intersection between two topics.
     *
     * Get the episodes at the intersection between the set of episodes
     * which include topic1 and the set of episodes that include topic2.
     *
     * @param {String} topic1 - The topic for the first set of episodes.
     * @param {String} topic2 - The topic for the second set of episodes.
     * @return {Array<EpisodeGraphic>} The episodes that intersect between these
     *      two sets.
     */
    var getPair = function(topic1, topic2) {
        var pairKey = createPairKey(topic1, topic2);
        if (counts.has(pairKey)) {
            return counts.get(pairKey);
        } else {
            return null;
        }
    };

    /**
     * Create a hash for the pair of two topics.
     *
     * @private
     * @param {String} topic1 - The first topic in the pair of topics.
     * @param {String} topic2 - The second topic in the pair of topics.
     * @return {String} Hash describing the pair of topics where the order in
     *      which the topics is provided is irrelevant.
     */
    var createPairKey = function(topic1, topic2) {
        if (topic1 < topic2) {
            return topic1 + " " + topic2;
        } else {
            return topic2 + " " + topic1;
        }
    };

    // -- Constructor --
    counts = dict();

    // -- Attach public members --
    this.getJaccard = getJaccard;
    this.processEpisode = processEpisode;
    this.getPairSize = getPairSize;
    this.getPair = getPair;
}
