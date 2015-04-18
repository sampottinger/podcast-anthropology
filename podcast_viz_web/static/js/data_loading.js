/**
 * Drivers and logic for loading visualization data.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


var curDataset;
var curCoocurranceMatrix;
var topicSet;


/**
 * Load a date from an ISO 8601 serliazation.
 *
 * @param {String} dateStr - The serialized date as an ISO 8601 string.
 * @return {Moment} Parsed date as a moment instance.
 */
var loadDate = function(dateStr) {
    var components = dateStr.split("-");
    var newYear = parseInt(components[0], 10);
    var newMonth = parseInt(components[1], 10);
    var newDay = parseInt(components[2], 10);
    return moment({year: newYear, month: newMonth, day: newDay});
};


/**
 * Create Episode objects from parsed raw JSON objects.
 *
 * Factory function which creates Episode objects from a parsed but raw JSON
 * document with visualization data. The returned objects can be decorated
 * for use in visualization graphics.
 *
 * Episodes exist in a many Episodes to one Show relationship.
 *
 * @param {Array<Object>} parsedArray - The raw JSON objects that should be
 *      converted to Episode objects.
 * @return {Array<Episode>} Episodes loaded from parsedArray.
 */
var loadEpisodes = function(parsedArray) {
    var numEpisodes = parsedArray.length;

    var retList = [];

    for (var episodeIndex = 0; episodeIndex < numEpisodes; episodeIndex++) {
        var sourceJSON = parsedArray[episodeIndex];

        var newTopicsArray = sourceJSON["tags"];

        retList.push(new Episode(
            sourceJSON["name"],
            loadDate(sourceJSON["date"]),
            sourceJSON["loc"],
            sourceJSON["duration"],
            newTopicsArray,
            sourceJSON["show"]
        ));
    }

    return retList;
};


/**
 * Create Topic objects from parsed raw JSON objects.
 *
 * Factory function which creates Topic objects from a parsed but raw JSON
 * document with visualization data. The returned objects can be decorated
 * for use in visualization graphics.
 *
 * Topics exist in a many Topics to one Show relationship and a many Topics
 * to one Episode relationship.
 *
 * @param {Array<Object>} parsedArray - The raw JSON objects that should be
 *      converted to Topic objects.
 * @return {domenic.dict} Topics loaded from parsedArray represented as a dict
 *      mapping {String} topic name to {Topic}.
 */
var loadTopics = function(parsedArray) {
    var numTopics = parsedArray.length;
    var retTopics = dict();

    for (var topicIndex = 0; topicIndex < numTopics; topicIndex++) {
        var sourceJSON = parsedArray[topicIndex];
        var newTopic = new Topic(
            sourceJSON["name"],
            sourceJSON["num_episodes"],
            sourceJSON["duration"]
        );
        retTopics.set(newTopic.getName(), newTopic);
    }

    return retTopics;
};


/**
 * Create Show objects from parsed raw JSON objects.
 *
 * Factory function which creates Show objects from a parsed but raw JSON
 * document with visualization data. The returned objects can be decorated
 * for use in visualization graphics.
 *
 * Shows exist in a many Episodes to one Show relationship.
 *
 * @param {Array<Object>} parsedArray - The raw JSON objects that should be
 *      converted to Show objects.
 * @return {domenic.dict} Shows loaded from parsedArray represented as a dict
 *      mapping {String} show name to {Show}.
 */
var loadShows = function(parsedArray) {
    var numShows = parsedArray.length;
    var retShows = dict();

    for (var showIndex = 0; showIndex < numShows; showIndex++) {
        var sourceJSON = parsedArray[showIndex];

        var newTopicsArray = sourceJSON["tags"];

        var newShow = new Show(
            sourceJSON["name"],
            newTopicsArray,
            sourceJSON["episodes"],
            sourceJSON["duration"]
        );
        retShows.set(newShow.getName(), newShow);
    }

    return retShows;
};


/**
 * Initialize the set of topic names.
 *
 * @param {Array<Topic>} topics - The list of topics from which the set of
 *      topic names should be seeded
 */
var loadTopicNamesSet = function(topics) {
    topicSet = [];

    topics.forEach(function(topic) {
        topicSet.push(topic.getName());
    });
};


/**
 * Load Topics, Shows, and Episodes from a JSON file with visualization data.
 */
var loadDataset = function() {
    var datasetSource = loadJSONObject(DATASET_JSON_LOC);

    loadTopicNamesSet(datasetSource["tags"]);

    curDataset = new Dataset(
        loadEpisodes(datasetSource["episodes"]),
        loadTopics(datasetSource["tags"]),
        loadShows(datasetSource["shows"])
    );
};
