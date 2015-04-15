function Episode (newName, newPubDate, newLocation, newDur, newTopics,
    newShow) {

    // Private vars
    var name;
    var pubDate;
    var location;
    var dur;
    var topics;
    var show;

    // Method declarations
    var getName = function () {
        return name;
    };

    var getPubDate = function () {
        return pubDate;
    };

    var getLocation = function () {
        return location;
    };

    var getDur = function () {
        return dur;
    };

    var getTopics = function () {
        return topics;
    };

    var getShow = function () {
        return show;
    };

    var compareTo = function (other) {
        if (getPubDate().isBefore(other.getPubDate())) {
            return -1;
        } else if (getPubDate().isAfter(other.getPubDate())) {
            return 1;
        } else {
            return 0;
        }
    };

    // Init
    name = newName;
    pubDate = newPubDate;
    location = newLocation;
    dur = newDur;
    topics = newTopics;
    show = newShow;

    // Attach public members
    this.getName = getName;
    this.getPubDate = getPubDate;
    this.getLocation = getLocation;
    this.getDur = getDur;
    this.getTopics = getTopics;
    this.getShow = getShow;
    this.compareTo = compareTo;
}


function Topic (newName, newNumEpisodes, newDur) {
    // Private vars
    var name;
    var numEpisodes;
    var dur;

    // Method declarations
    var getName = function () {
        return name;
    };

    var getNumEpisodes = function () {
        return numEpisodes;
    };

    var getDur = function () {
        return dur;
    };

    // Init
    name = newName;
    numEpisodes = newNumEpisodes;
    dur = newDur;

    // Attach public members
    this.getName = getName;
    this.getNumEpisodes = getNumEpisodes;
    this.getDur = getDur;
}


function Show (newName, newTopics, newNumEpisodes, newDur) {
    // Private vars
    var name;
    var topics;
    var numEpisodes;
    var dur;

    // Method declarations
    var getName = function () {
        return name;
    };

    var getTopics = function () {
        return topics;
    };

    var getEpisodes = function () {
        return numEpisodes;
    };

    var getDur = function () {
        return dur;
    };


    // Init
    name = newName;
    topics = newTopics;
    numEpisodes = newNumEpisodes;
    dur = newDur;

    // Attach public members
    this.getName = getName;
    this.getTopics = getTopics;
    this.getEpisodes = getEpisodes;
    this.getDur = getDur;
}


function Dataset (newEpisodes, newTopics, newShows) {
    // Private vars
    var episodes;
    var topics;
    var shows;

    var getEpisodes = function () {
        return episodes;
    };

    var getTopics = function () {
        return topics;
    };

    var getShows = function () {
        return shows;
    };

    // Init
    episodes = dict();
    episodes.set("This American Life", []);
    episodes.set("Hello Internet", []);
    episodes.set("99% Invisible", []);
    episodes.set("The Memory Palace", []);
    episodes.set("Radiolab", []);
    
    newEpisodes.forEach(function (newEpisode) {
        episodes.get(newEpisode.getShow()).push(newEpisode);
    });

    episodes.forEach(function (episode, showName) {
        sortObjArray(episodes.get(showName));
    });

    topics = newTopics;
    shows = newShows;

    // Attach public members
    this.getEpisodes = getEpisodes;
    this.getTopics = getTopics;
    this.getShows = getShows;
}
