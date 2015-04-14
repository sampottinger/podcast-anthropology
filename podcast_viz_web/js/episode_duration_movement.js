var createDurationAggregators = function () {
    var retList = [];

    var maxDuration = 0;
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        graphicEpisodes.get(showName).forEach(function (episode) {
            var dur = episode.getEpisode().getDur();
            if (maxDuration < dur) {
                maxDuration = dur;
            }
        });
    });

    for (var i=0; i * 20 * 60<=maxDuration; i += 1) {
        retList.push(new DurationAggregationCategory(
            (i * 20) * 60 + 1,
            ((i + 1) * 20) * 60 + 1
        ));
    }

    return retList;
};


var placeAllEpisodesByDuration = function (startY) {
    // Place episodes
    var aggregators = createDurationAggregators();
    
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        graphicEpisodes.get(showName).forEach(function (episode) {
            aggregators.forEach(function (aggregator) {
                aggregator.processEpisode(episode);
            });
            activeScollableEntities.push(episode);
        });
    });

    var aggNum = 0;
    var targetLoc = null;
    var maxY = 0;
    aggregators.forEach(function (aggregator) {
        var innerGroupNum = 0;
        aggregator.getMatchedEpisodes().forEach(function (episode) {
            var targetX = EPISODE_DIAMETER * Math.floor(innerGroupNum / 21);
            targetX += TIMELINE_GROUP_START_X;
            
            var targetY = aggNum * DURATION_GROUP_HEIGHT;
            targetY += startY;
            targetY += (innerGroupNum % 21) * EPISODE_DIAMETER;
            
            targetLoc = new p5.Vector(targetX, targetY);
            episode.goTo(targetLoc);
            innerGroupNum++;
            maxY = maxY > targetY ? maxY : targetY;
        });
        aggNum++;
    });

    // Create legend
    var labels = [];
    
    var i = 0;
    aggregators.forEach(function (aggregator) {
        labels.push(str(i * 20 + 1) + "-" + str((i+1) * 20) + " min");
        i++;
    });
    
    var legends = createAggCategoriesLegends(
        TIMELINE_GROUP_START_X - 23,
        startY + EPISODE_DIAMETER - 10,
        -100,
        aggregators,
        DURATION_GROUP_HEIGHT,
        labels
    );
    legends.forEach(function (legend) {
        activeScollableEntities.push(legend);
    });

    return new p5.Vector(0, maxY);
};


var enterEpisodeDurationView = function () {
    var lastEnd;

    // Clear old elements
    activeNonScollableEntities = [];
    activeScollableEntities = [];
    createNavArea();

    activeScollableEntities.push(new Title(
        5,
        START_Y_MAIN,
        WIDTH,
        "Episodes by duration"
    ));
    lastEnd = placeAllEpisodesByDuration(
        START_Y_MAIN + EPISODE_DIAMETER + 5
    );

    // Create slider
    curScrollSlider = new Slider(
        WIDTH - SCROLL_WIDTH,
        WIDTH,
        START_Y_MAIN + 1,
        HEIGHT - DETAILS_AREA_HEIGHT - 2,
        0,
        lastEnd.y + DURATION_GROUP_HEIGHT,
        HEIGHT - DETAILS_AREA_HEIGHT - START_Y_MAIN
    );
    activeNonScollableEntities.push(curScrollSlider);
};