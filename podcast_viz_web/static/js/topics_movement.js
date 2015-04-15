var topicMovementCenters;
var topicPositions;
var selectedTopic = null;
var topicsDisplayDirty = true;
var topicsRegion;
var arcCache;


var createTopicShowSources = function () {
    // Place shows
    var y = START_Y_MAIN + 60;
    topicMovementCenters = dict();
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        topicMovementCenters.set(showName, new p5.Vector(30, y));
        y += 100;
    });

    // Create show sources
    var lastEnd = new p5.Vector(0, START_Y_MAIN - 50);
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        var center = topicMovementCenters.get(showName);

        graphicEpisodes.get(showName).forEach(function (episode) {
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


var createCachedTopics = function () {
    var retList = [];

    topicSet.forEach(function (topic) {
        var overlap = curCoocurranceMatrix.getPairSize(topic, topic);
        retList.push([overlap, new CachedTopic(topic, overlap)]);
    });

    retList.sort(function (a, b) {
        return b[0] - a[0];
    });

    return retList.map(function (a) { return a[1]; });
};


var createTopicDisplays = function () {
    var newPos = null;
    var cachedTopics = createCachedTopics();
    var entities = [];
    topicPositions = dict();

    var maxCount = cachedTopics[0].getCount();
    var barScale = new LinearScale(0, maxCount, 0, 90);

    var x = WIDTH - 350;
    var y = START_Y_MAIN + 30;
    cachedTopics.forEach(function (topic) {
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
        "Topics"
    ));

    activeScollableEntities.push(new Title(
        WIDTH - 255,
        START_Y_MAIN + 10,
        200,
        "Topic Connections"
    ));

    return newPos;
};


var createArcs = function (newHeight) {
    var overlapScale = new LinearScale(0.08, 1, 1, 20);
    var arcsToCache = [];

    topicSet.forEach(function (topic1) {
        topicSet.forEach(function (topic2) {
            if (topic1 < topic2) {
                var overlapSize = curCoocurranceMatrix.getPairSize(topic1, topic2);
                if (overlapSize > 1) {
                    var giniVal = curCoocurranceMatrix.getGini(topic1, topic2);
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


var enterTopicMovement = function () {
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

    setTimeout(function () { arcCache.setActive(true); }, 2000);
};


var selectTopic = function (topic) {
    reportUsage("topic-" + topic);

    topicsRegion.setActive(false);
    arcCache.setActive(false);

    var i = 0;
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        graphicEpisodes.get(showName).forEach(function (episode) {
            var center = topicMovementCenters.get(showName);
            episode.goTo(new p5.Vector(
                center.x + 50,
                center.y
            ));
        });
    });

    curCoocurranceMatrix.getPair(topic, topic).forEach(function (episode) {
        var xNum = i % 10;
        var yNum = Math.floor(i / 10);
        var x = xNum * EPISODE_DIAMETER + 150;
        var y = yNum * EPISODE_DIAMETER + START_Y_MAIN + 20;
        episode.goTo(new p5.Vector(x, y));
        i++;
    });

    setTimeout(function () {
        topicsRegion.setActive(true);
        arcCache.setActive(true);
    }, 1500);
};
