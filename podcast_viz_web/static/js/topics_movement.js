/**
 * Logic and structures for the "topics" movement.
 *
 * Logic and structures to run the "topics view" into the source data where
 * each topic discussed across the podcasts can be examined by the user. Note
 * that some support structures also appear in topics_movement_struct.js.
 *
 * @author Sam Pottinger
 * @license MIT License
 */

// TODO(apottinger): Refactor movements into classes (one class per movement).

var topicMovementCenters;
var topicPositions;
var selectedTopic = null;
var topicsDisplayDirty = true;
var topicsRegion;
var arcCache;


/**
 * Create a region where the episode particles can sit while inactive.
 *
 * Create a location where each podcast's episodes (reprsented as
 * {EpisodeGraphic} instances) can sit while they are inavtive (not part of
 * the user's current topic selection).
 */
var createTopicShowSources = function() {
    // Place shows
    var y = START_Y_MAIN + 60;
    topicMovementCenters = dict();
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        topicMovementCenters.set(showName, new p5.Vector(30, y));
        y += 100;
    });

    // Create show sources
    var lastEnd = new p5.Vector(0, START_Y_MAIN - 50);
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        var center = topicMovementCenters.get(showName);

        graphicEpisodes.get(showName).forEach(function(episode) {
            var episodeCenter = new p5.Vector(center.x + 50, center.y);
            episode.goTo(episodeCenter);
            activeNonScollableEntities.push(episode);
        });

        var showBubble = new ShowBubble(
            new p5.Vector(center.x, center.y),
            curDataset.getShows().get(showName)
        );
        activeNonScollableEntities.push(showBubble);
    });
};


/**
 * Pre-compute the overlap between topics for faster co-ocurrance visualization.
 *
 * @return {Array<CachedTopic>} Cached topic overlaps.
 */
var createCachedTopics = function() {
    var retList = [];

    topicSet.forEach(function(topic) {
        var overlap = curCoocurranceMatrix.getPairSize(topic, topic);
        retList.push([overlap, new CachedTopic(topic, overlap)]);
    });

    retList.sort(function(a, b) {
        return b[0] - a[0];
    });

    return retList.map(function(a) { return a[1]; });
};


/**
 * Create a graphic showing the topics discussed across podcasts.
 * 
 * @return {p5js.Vector} The position of the topic graphic with the largest y
 *      coordinate.
 */
var createTopicDisplays = function() {
    var newPos = null;
    var cachedTopics = createCachedTopics();
    var entities = [];
    topicPositions = dict();

    var maxCount = cachedTopics[0].getCount();
    var barScale = new LinearScale(0, maxCount, 0, 90);

    var x = WIDTH - 350;
    var y = START_Y_MAIN + 30;
    cachedTopics.forEach(function(topic) {
        newPos = new p5.Vector(x, y);
        var newGraphic = new GraphicalTopic(topic, barScale, newPos);
        entities.push(newGraphic);
        topicPositions.set(topic.getTopic(), new p5.Vector(x, y));
        y += 14;
    });

    topicsRegion = new EntityRegion(entities);
    topicsRegion.setMinX(x - 100);
    topicsRegion.setMaxX(x + 100);
    topicsRegion.setMinY(START_Y_MAIN);
    activeScollableEntities.push(topicsRegion);

    activeScollableEntities.push(new Title(
        WIDTH - 450,
        START_Y_MAIN + 10,
        190,
        "Click a Topic"
    ));

    activeScollableEntities.push(new Title(
        WIDTH - 255,
        START_Y_MAIN + 10,
        200,
        "Topic Connections"
    ));

    return newPos;
};


/**
 * Create arcs showing the co-ocurrance between topics.
 *
 * @param {Number} newHeight The height of the topics display to which the arc
 *      arc diagram should be appended.
 */
var createArcs = function(newHeight) {
    var overlapScale = new LinearScale(0.08, 1, 1, 20);
    var arcsToCache = [];

    topicSet.forEach(function(topic1) {
        topicSet.forEach(function(topic2) {
            
            if (topic1 < topic2) {
                var overlapSize = curCoocurranceMatrix.getPairSize(
                    topic1,
                    topic2
                );
                
                if (overlapSize > 1) {
                    var giniVal = curCoocurranceMatrix.getJaccard(
                        topic1,
                        topic2
                    );
                    if (giniVal > 0.1) {
                        arcsToCache.push(new OverlapArc(
                            topicPositions.get(topic1).y + 5,
                            topicPositions.get(topic2).y + 5,
                            giniVal,
                            overlapScale,
                            topic1,
                            topic2
                        ));
                    }
                }
            }

        });
    });

    arcCache = new CachedArcs(0, 0, newHeight, arcsToCache);
    activeScollableEntities.push(arcCache);
};


/**
 * Transition the visualization into the "topic" movement.
 */
var enterTopicMovement = function() {
    reportUsage("topic");

    // Clear old elements
    activeNonScollableEntities = [];
    activeScollableEntities = [];
    createNavArea();

    createTopicShowSources();
    var endPos = createTopicDisplays();
    createArcs(endPos.y);
    arcCache.setActive(false);

    // Create slider
    curScrollSlider = new Slider(
        WIDTH - SCROLL_WIDTH,
        WIDTH,
        START_Y_MAIN + 1,
        HEIGHT - DETAILS_AREA_HEIGHT - 2,
        0,
        endPos.y + DURATION_GROUP_HEIGHT,
        HEIGHT - DETAILS_AREA_HEIGHT - START_Y_MAIN
    );
    activeNonScollableEntities.push(curScrollSlider);

    setTimeout(function() { arcCache.setActive(true); }, 2000);
};


/**
 * Callback for when the user selects a topic in the topics display.
 *
 * Callback for when the user selects a topic in the right hand-side topic
 * display, showing the overlap between that and other topics while also
 * moving the related episodes into the center of the visualization stage.
 *
 * @param {String} topic - The name of the topic selected by the user.
 */
var selectTopic = function(topic) {
    reportUsage("topic-" + topic);

    topicsRegion.setActive(false);
    arcCache.setActive(false);

    var i = 0;
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        graphicEpisodes.get(showName).forEach(function(episode) {
            var center = topicMovementCenters.get(showName);
            episode.goTo(new p5.Vector(
                center.x + 50,
                center.y
            ));
        });
    });

    curCoocurranceMatrix.getPair(topic, topic).forEach(function(episode) {
        var xNum = i % 10;
        var yNum = Math.floor(i / 10);
        var x = xNum * EPISODE_DIAMETER + 150;
        var y = yNum * EPISODE_DIAMETER + START_Y_MAIN + 20;
        episode.goTo(new p5.Vector(x, y));
        i++;
    });

    setTimeout(function() {
        topicsRegion.setActive(true);
        arcCache.setActive(true);
    }, 1500);
};
