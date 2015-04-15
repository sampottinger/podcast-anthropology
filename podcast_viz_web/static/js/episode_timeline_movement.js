var getToday = function () {
    return moment();
};


var createMonthAggregators = function () {
    var retList = [];
    
    var today = getToday();

    var offset = 0;
    var lastDate = START_DATE;
    while (lastDate === null || today.valueOf() - lastDate.valueOf() >= 0) {
        var newDate = START_DATE.push(offset, "month");
        offset++;
        retList.push(new DateAggregationCategory(
            lastDate,
            newDate
        ));
        lastDate = newDate;
    }

    return retList;
};


var createYearAggregators = function () {
    var retList = [];
    
    var today = getToday();

    var offset = 1;
    var lastDate = START_DATE;
    while (lastDate === null || today.valueOf() - lastDate.valueOf() >= 0) {
        var newDate = START_DATE.clone();
        newDate.add(offset, "years");
        offset++;
        retList.push(new DateAggregationCategory(
            lastDate,
            newDate
        ));
        lastDate = newDate;
    }

    return retList;
};


var placeAllEpisodesByTime = function (startY) {
    // Place episodes
    var aggregators = createYearAggregators();
    aggregators.reverse();
    
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
    var numAggregators = aggregators.length;
    aggregators.forEach(function (aggregator) {
        var innerGroupNum = 0;
        aggregator.getMatchedEpisodes().forEach(function (episode) {
            var targetX = EPISODE_DIAMETER * Math.floor(innerGroupNum / 5);
            targetX += TIMELINE_GROUP_START_X;
            
            var targetY = aggNum * TIMELINE_GROUP_HEIGHT;
            targetY += startY;
            targetY += (innerGroupNum % 5) * EPISODE_DIAMETER;
            
            targetLoc = new p5.Vector(targetX, targetY);
            episode.goTo(targetLoc);
            innerGroupNum++;
            maxY = maxY > targetY ? maxY : targetY;
        });
        aggNum++;
    });

    // Create legend
    var labels = [];
    
    aggregators.forEach(function (aggregator) {
        labels.push(str(aggregator.getStartDate().year()));
    });
    
    var legends = createAggCategoriesLegends(
        TIMELINE_GROUP_START_X - 23,
        startY + EPISODE_DIAMETER - 10,
        -100,
        aggregators,
        TIMELINE_GROUP_HEIGHT,
        labels
    );
    legends.forEach(function (legend) {
        activeScollableEntities.push(legend);
    });

    return new p5.Vector(0, maxY);
};


var createPostingDifferencesDisplay = function (startY, proto) {
    var differences = dict();

    var i;
    var bodyStartY = startY + 18;

    // Place legends and calculate aggregates
    i = 1;
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        var y = 30 * i + bodyStartY;

        activeScollableEntities.push(new TinyLegend(
            TIMELINE_GROUP_START_X,
            y - 3,
            showName,
            SHOW_COLORS.get(showName).getFill()
        ));

        var diffAgg = new DifferenceAggregator(5);
        curDataset.getEpisodes().get(showName).forEach(function (episode) {
            diffAgg.processNewDate(episode.getPubDate());
        });
        differences.set(showName, diffAgg);

        i++;
    });

    // Create graphics
    proto.setAggSettings(differences, 5, 50, 0, 50, true);
    proto.setYCoord(bodyStartY);
    proto.setText(
        "0%",
        "50%",
        "Days between episodes",
        new RawAxisLabelStrategy()
    );
    proto.setContextStrategy({
        generateMessage: function (xVal, yVal) {
            return nfc(int(yVal)) + "% with " + nfc(int(xVal)) + " days between episodes";
        }
    });

    var barChart = new AggregationBarChart(proto);
    activeScollableEntities.push(barChart);

    return barChart.getEndY();
};


var createPostingMonthDisplay = function (startY, proto) {
    var months = dict();

    var i;
    var bodyStartY = startY + 18;

    // Place legends and calculate aggregates
    i = 1;
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        var y = 30 * i + bodyStartY;

        activeScollableEntities.push(new TinyLegend(
            TIMELINE_GROUP_START_X,
            y - 7,
            showName,
            SHOW_COLORS.get(showName).getFill()
        ));

        var diffAgg = new MonthAggregator();
        curDataset.getEpisodes().get(showName).forEach(function (episode) {
            diffAgg.processNewDate(episode.getPubDate());
        });
        months.set(showName, diffAgg);

        i++;
    });

    // Create graphics
    proto.setAggSettings(months, 1, 12, 1995 * 12 + 11, 3, false);
    proto.setYCoord(bodyStartY);
    proto.setText(
        "0",
        "3",
        "Episodes by month",
        new MonthNumToYearLabelStrategy()
    );
    proto.setContextStrategy({
        generateMessage: function (xVal, yVal) {
            var offsetTime = START_DATE.clone().add(Math.floor(xVal), "months");
            return nfc(Math.floor(yVal)) + " episodes in " + offsetTime.format("MMM, YYYY");
        }
    });

    var barChart = new AggregationBarChart(proto);
    activeScollableEntities.push(barChart);

    return barChart.getEndY();
};


var enterEpisodeTimeline = function () {
    reportUsage("timeline");

    // Clear old elements
    activeNonScollableEntities = [];
    activeScollableEntities = [];
    createNavArea();

    // Finds bounds for embedded bar charts
    var startScaleX = TIMELINE_GROUP_START_X + 20;
    var endScaleX = WIDTH - 50;
    var proto = new AggregationBarChartProto();
    proto.setXCoord(startScaleX, endScaleX);

    // Create and display differences
    var lastEnd = new p5.Vector(
        0,
        createPostingMonthDisplay(START_Y_MAIN, proto)
    );

    // Create yearly display
    activeScollableEntities.push(new Title(
        5,
        lastEnd.y,
        WIDTH,
        "Detailed episodes by year"
    ));
    lastEnd = placeAllEpisodesByTime(lastEnd.y + EPISODE_DIAMETER + 5);

    // Create and display differences
    lastEnd = new p5.Vector(
        0,
        createPostingDifferencesDisplay(
            lastEnd.y + 30 + EPISODE_DIAMETER,
            proto
        )
    );

    // Create slider
    curScrollSlider = new Slider(
        WIDTH - SCROLL_WIDTH,
        WIDTH,
        START_Y_MAIN + 1,
        HEIGHT - DETAILS_AREA_HEIGHT - 2,
        0,
        lastEnd.y + 10,
        HEIGHT - DETAILS_AREA_HEIGHT - START_Y_MAIN
    );
    activeNonScollableEntities.push(curScrollSlider);
};
