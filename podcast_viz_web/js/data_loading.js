var curDataset;
var curCoocurranceMatrix;
var topicSet;


var loadDate = function (dateStr) {
    var components = dateStr.split("-");
    var newYear = int(components[0]);
    var newMonth = int(components[1]);
    var newDay = int(components[2]);
    return moment({year: newYear, month: newMonth, day: newDay});
};


var loadEpisodes = function (parsedArray) {
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


var loadTopics = function (parsedArray) {
    var numTopics = parsedArray.length;
    var retTopics = dict();
    topicSet = [];

    for (var topicIndex = 0; topicIndex < numTopics; topicIndex++) {
        var sourceJSON = parsedArray[topicIndex];
        var newTopic = new Topic(
            sourceJSON["name"],
            sourceJSON["num_episodes"],
            sourceJSON["duration"]
        );
        retTopics.set(newTopic.getName(), newTopic);
    }

    retTopics.forEach(function (value, key) {
        topicSet.push(key);
    })

    return retTopics;
};


var loadShows = function (parsedArray) {
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


var loadDataset = function () {
    var datasetSource = loadJSONObject(DATASET_JSON_LOC);

    curDataset = new Dataset(
        loadEpisodes(datasetSource["episodes"]),
        loadTopics(datasetSource["tags"]),
        loadShows(datasetSource["shows"])
    );
};
