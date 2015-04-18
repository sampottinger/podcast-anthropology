/**
 * Structures modeling / representing visualization data.
 *
 * Structures to represent the Shows with their Episodes and those Episodes'
 * topics within the visualization. These objects can be decorated for use
 * as graphics within the visualization.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Structure representing a podcast episode.
 *
 * Structure representing a single podcast episode where a Show can contain
 * many Episodes.
 *
 * @constructor
 * @param {String} newName - The name of the episode.
 * @param {Moment} newPubDate - The date when the episode was published.
 * @param {String} newLocation - The URL where additional episode data can be
 *      retrieved. Note that this is NOT a podcast player and this URL should
 *      NOT point to the audio itself.
 * @param {Numer} newDur
 */
function Episode(newName, newPubDate, newLocation, newDur, newTopics, newShow) {

    // -- Private vars --
    var name;
    var pubDate;
    var location;
    var dur;
    var topics;
    var show;

    // -- Method declarations --

    /**
     * Get the human readable name of this episode.
     *
     * @return {String} The name of this episode.
     */
    var getName = function() {
        return name;
    };

    /**
     * Get the date on which this episode was published.
     *
     * @return {Moment} The date on which this episode was published.
     */
    var getPubDate = function() {
        return pubDate;
    };

    /**
     * Get the URL where more information about this episode can be found.
     *
     * @return {String} The URL where additional information about this
     *      episode can be found.
     */
    var getLocation = function() {
        return location;
    };

    /**
     * Get the duration of this episode in seconds.
     *
     * @return {Number} The duration of this episode in seconds.
     */
    var getDur = function() {
        return dur;
    };

    /**
     * Get the list of topics this episode discusses.
     *
     * @return {Array<Topic>} The topics discussed in this episode.
     */
    var getTopics = function() {
        return topics;
    };

    /**
     * Get the show that this episode is part of.
     *
     * @return {Show} The show that this episode is part of.
     */
    var getShow = function() {
        return show;
    };

    /**
     * Determine if this episode came before or after another.
     *
     * @param {Episode} other - The Episode to compare against.
     * @return {Number} A negative number if this episode was published before
     *      other, zero if they were published on the same date, and a
     *      positive number if this episode was published after other.
     */
    var compareTo = function(other) {
        if (getPubDate().isBefore(other.getPubDate())) {
            return -1;
        } else if (getPubDate().isAfter(other.getPubDate())) {
            return 1;
        } else {
            return 0;
        }
    };

    // -- Constructor --
    name = newName;
    pubDate = newPubDate;
    location = newLocation;
    dur = newDur;
    topics = newTopics;
    show = newShow;

    // -- Attach public members --
    this.getName = getName;
    this.getPubDate = getPubDate;
    this.getLocation = getLocation;
    this.getDur = getDur;
    this.getTopics = getTopics;
    this.getShow = getShow;
    this.compareTo = compareTo;
}


/**
 * Structure representing a podcast episode.
 *
 * Structure representing a single topic discussed in a podcast episode where a
 * Show can contain many Episodes while both an Episode and Show can contain
 * many Topics.
 *
 * @constructor
 * @param {String} newName - The name of the topic as parsed from the podcast.
 * @param {Number} newNumEpisodes - The number of episodes in the show that
 *      discuss this topic.
 * @param {Number} newDur - The total number of seconds across all shows
 *      discussing this topic.
 */
function Topic(newName, newNumEpisodes, newDur) {

    // -- Private vars --
    var name;
    var numEpisodes;
    var dur;

    // -- Method declarations --

    /**
     * Get the name of a topic.
     *
     * @return {String} Human-readable name of this topic.
     */
    var getName = function() {
        return name;
    };

    /**
     * Get the number of episodes discussing this topic.
     *
     * @return {Number} Integer count of episodes discussing this topic.
     */
    var getNumEpisodes = function() {
        return numEpisodes;
    };

    /**
     * Get the duration of all episodes discusussing this topic.
     *
     * @return {Number} Sum of the duration of all episodes in which this topic
     *      appears reported in integer number of seconds.
     */
    var getDur = function() {
        return dur;
    };

    // -- Constructor --
    name = newName;
    numEpisodes = newNumEpisodes;
    dur = newDur;

    // -- Attach public members --
    this.getName = getName;
    this.getNumEpisodes = getNumEpisodes;
    this.getDur = getDur;
}


/**
 * Structure representing a single podcast.
 *
 * Structure representing a single podcast ("Show") where a Show can contain
 * many Episodes while both an Episode and Show can contain many Topics.
 *
 * @constructor
 * @param {String} newName - The name of the podcast.
 * @param {Array<Topic>} newTopics - Enumeration of topics appearing within
 *      this show's episodes.
 * @param {Number} newNumEpisodes - The number of episodes that make up this
 *      podcast.
 * @param {Number} newDur - The sum of the duration of all episodes within this
 *      podcast reported in seconds.
 */
function Show(newName, newTopics, newNumEpisodes, newDur) {

    // -- Private vars --
    var name;
    var topics;
    var numEpisodes;
    var dur;

    // -- Method declarations --

    /**
     * Get the name of this podcast.
     *
     * @return {String} Human-readable name of this podcast.
     */
    var getName = function() {
        return name;
    };

    /**
     * Get the list of topics appearing in this podcast.
     *
     * @return {Array<Topic>} List of topics appearing in this podcast.
     */
    var getTopics = function() {
        return topics;
    };

    /**
     * Get the number of episodes appearing in this podcast.
     *
     * @return {Number} The integer count of episodes appearing in this podcast.
     */
    var getEpisodes = function() {
        return numEpisodes;
    };

    /**
     * Get the sum of the duration of episodes appering in this podcast.
     *
     * @return {Number} The sum integer count of seconds across all episodes
     *      appearing in this podcast.
     */
    var getDur = function() {
        return dur;
    };


    // -- Constructor --
    name = newName;
    topics = newTopics;
    numEpisodes = newNumEpisodes;
    dur = newDur;

    // -- Attach public members --
    this.getName = getName;
    this.getTopics = getTopics;
    this.getEpisodes = getEpisodes;
    this.getDur = getDur;
}


/**
 * Top-level representation of the visualization data.
 *
 * Top-level representation of all of the visualization source data including
 * all topics, episodes, and shows (podcasts) being visualized.
 *
 * @constructor
 * @param {Array<Episode>} newEpisodes - The episodes appearing in this
 *      visualization (order independent).
 * @param {domenic.dict} newTopics - The topics appearing in this visualization
 *      as a dict mapping {String} topic name to {Topic}.
 * @param {domenic.dict} newShows - The shows appearing in this visualization
 *      as a dict mapping {String} show name to {Show}.
 */
function Dataset(newEpisodes, newTopics, newShows) {

    // -- Private vars --
    var episodes;
    var topics;
    var shows;

    // -- Method declarations --

    /**
     * Get the list of episodes appearing in each podcast.
     *
     * @return {domenic.dict} Dict mapping the {String} name of the podcast to
     *      to an {Array<Episode>} with all episodes appearing in that podcast.
     */
    var getEpisodes = function() {
        return episodes;
    };

    /**
     * Get the topics appearing across all podcasts / episodes.
     *
     * @return {domenic.dict} Dict mapping {String} topic name to {Topic}.
     */
    var getTopics = function() {
        return topics;
    };

    /**
     * Get all dataset shows organized by podcast name.
     *
     * @return {domenic.dict} Dict mapping {String} podcast name to
     *      {Array<Episode>}, a collection of all episodes for that podcast.
     */
    var getShows = function() {
        return shows;
    };

    // -- Constructor --
    episodes = dict();
    episodes.set("This American Life", []);
    episodes.set("Hello Internet", []);
    episodes.set("99% Invisible", []);
    episodes.set("The Memory Palace", []);
    episodes.set("Radiolab", []);
    
    newEpisodes.forEach(function(newEpisode) {
        episodes.get(newEpisode.getShow()).push(newEpisode);
    });

    episodes.forEach(function(episode, showName) {
        sortObjArray(episodes.get(showName));
    });

    topics = newTopics;
    shows = newShows;

    // Attach public members
    this.getEpisodes = getEpisodes;
    this.getTopics = getTopics;
    this.getShows = getShows;
}
