/**
 * Movement which describes the duration of different podcasts.
 *
 * Section or "movement" within the visualization showing how long each podcast
 * and podcast episode was.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


// TODO(apottinger): Refactor movements into classes (one class per movement).


/**
 * Create categories which break down or "bucket" epsiodes by length.
 *
 * @return {Array<DurationAggregationCategory>} Buckets which provide a
 *      histogram-like data structure where each bucket is made up of episodes
 *      whose length falls into that bucket's duration range.
 */
var createDurationAggregators = function() {
    var retList = [];

    var maxDuration = 0;
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        graphicEpisodes.get(showName).forEach(function(episode) {
            var dur = episode.getEpisode().getDur();
            if (maxDuration < dur) {
                maxDuration = dur;
            }
        });
    });

    // TODO(apottinger): Break these out into constants for readability.
    for (var i=0; i * 20 * 60 <= maxDuration; i += 1) {
        retList.push(new DurationAggregationCategory(
            (i * 20) * 60 + 1,
            ((i + 1) * 20) * 60 + 1
        ));
    }

    return retList;
};


/**
 * Place all of the episodes and shows into groups based on duration.
 *
 * Place all of the episodes into a visual structure like a histogram but where
 * each bar is made up of the episode particles (individual podcasts episodes
 * represented as small graphics). The histogram "buckets" epiodes by the
 * duration of the episode.
 *
 * @param {Number} startY - The starting Y coordinate of the histogram in
 *      pixels. The histogram will extend downwards from this coordinate.
 * @return {Number} The Y coordinate to where the histogram extends. The
 *      vertical component bounding box of the histogram would extend from
 *      startY to this return value.
 */
var placeAllEpisodesByDuration = function(startY) {
    // Place episodes
    var aggregators = createDurationAggregators();
    
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        graphicEpisodes.get(showName).forEach(function(episode) {
            aggregators.forEach(function(aggregator) {
                aggregator.processEpisode(episode);
            });
            activeScollableEntities.push(episode);
        });
    });

    var aggNum = 0;
    var targetLoc = null;
    var maxY = 0;
    aggregators.forEach(function(aggregator) {
        var innerGroupNum = 0;
        aggregator.getMatchedEpisodes().forEach(function(episode) {
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
    aggregators.forEach(function(aggregator) {
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
    legends.forEach(function(legend) {
        activeScollableEntities.push(legend);
    });

    return new p5.Vector(0, maxY);
};


/**
 * Driver to transition the visualization into the episode duration movement.
 */
var enterEpisodeDurationView = function() {
    reportUsage("duration");

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
