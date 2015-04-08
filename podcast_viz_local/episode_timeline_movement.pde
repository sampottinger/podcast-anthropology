import org.joda.time.DateTime; 

AggregationLevel curTimelineAggLevel = AggregationLevel.MONTH;


DateTime getToday () {
    return new DateTime(year(), month(), day(), 0, 0);
}


ArrayList<DateAggregationCategory> createMonthAggregators () {
    ArrayList<DateAggregationCategory> retList;
    retList = new ArrayList<DateAggregationCategory>();
    
    DateTime today = getToday();

    int offset = 0;
    DateTime lastDate = START_DATE;
    while (lastDate == null || today.compareTo(lastDate) >= 0) {
        DateTime newDate = START_DATE.plusMonths(offset);
        offset++;
        retList.add(new DateAggregationCategory(
            lastDate,
            newDate
        ));
        lastDate = newDate;
    }

    return retList;
}


ArrayList<DateAggregationCategory> createYearAggregators () {
    ArrayList<DateAggregationCategory> retList;
    retList = new ArrayList<DateAggregationCategory>();
    
    DateTime today = getToday();

    int offset = 1;
    DateTime lastDate = START_DATE;
    while (lastDate == null || today.compareTo(lastDate) >= 0) {
        DateTime newDate = START_DATE.plusYears(offset);
        offset++;
        retList.add(new DateAggregationCategory(
            lastDate,
            newDate
        ));
        lastDate = newDate;
    }

    return retList;
}


PVector placeAllEpisodes (float startY) {
    ArrayList<DateAggregationCategory> aggregators = createYearAggregators();
    
    for (String showName : ORDERED_SHOW_NAMES) {
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            for (DateAggregationCategory aggregator : aggregators) {
                aggregator.processEpisode(episode);
            }
            activeScollableEntities.add(episode);
        }
    }

    int aggNum = 0;
    PVector targetLoc = null;
    for (DateAggregationCategory aggregator : aggregators) {
        int innerGroupNum = 0;
        for (EpisodeGraphic episode : aggregator.getMatchedEpisodes()) {
            int targetX = EPISODE_DIAMETER * (innerGroupNum / 5);
            targetX += TIMELINE_GROUP_START_X;
            
            int targetY = aggNum * TIMELINE_GROUP_HEIGHT;
            targetY += startY;
            targetY += (innerGroupNum % 5) * EPISODE_DIAMETER;
            
            targetLoc = new PVector(targetX, targetY);
            episode.goTo(targetLoc);
            innerGroupNum++;
        }
        aggNum++;
    }

    return targetLoc;
}


PVector createPostingDifferencesDisplay () {
    int i;
    HashMap<String, DifferenceAggregator> differences;

    differences = new HashMap<String, DifferenceAggregator>();

    int bodyStartY = START_Y_MAIN + 18;

    // Place legends and calculate aggregates
    i = 1;
    for (String showName : ORDERED_SHOW_NAMES) {
        int y = 30 * i + bodyStartY;

        activeScollableEntities.add(new TinyLegend(
            TIMELINE_GROUP_START_X,
            y - 7,
            showName,
            SHOW_COLORS.get(showName).getFill()
        ));

        DifferenceAggregator diffAgg = new DifferenceAggregator(5);
        for (Episode episode : curDataset.getEpisodes().get(showName)) {
            diffAgg.processNewDate(episode.getPubDate());
        }
        differences.put(showName, diffAgg);

        i++;
    }

    // Build scales
    int maxDiff = 0;
    int maxBucketSize = 0;
    for (DifferenceAggregator agg : differences.values()) {
        int aggMax = agg.getMaxBucket();
        int sizeMax = agg.getMaxBucketSize();
        maxDiff = maxDiff > aggMax ? maxDiff : aggMax;
        maxBucketSize = maxBucketSize > sizeMax ? maxBucketSize : sizeMax;
    }

    float startScaleX = TIMELINE_GROUP_START_X + 20;
    float endScaleX = WIDTH - 50 - TIMELINE_GROUP_START_X;
    LinearScale xScale = new LinearScale(0, maxDiff, startScaleX, endScaleX);

    LinearScale yScale = new LinearScale(
        1,
        100,
        -1,
        -30
    );

    float barWidth = xScale.scale(5) - xScale.scale(0);

    // Create bars
    i = 1;
    for (String showName : ORDERED_SHOW_NAMES) {
        int y = 30 * i + bodyStartY;
        float numEpisdes = curDataset.getEpisodes().get(showName).size();

        HashMap<Integer, Integer> counts = differences.get(
            showName).getDifferences();

        for (Integer diff : counts.keySet()) {
            float x = xScale.scale(diff);
            float barPercent = (counts.get(diff) / numEpisdes) * 100;
            float barHeight = yScale.scale(barPercent);
            activeScollableEntities.add(
                new StaticRect(x, y, barWidth - 1, barHeight, MID_GREY)
            );
        }

        i++;
    }

    // Create title
    activeScollableEntities.add(new Title(
        5,
        START_Y_MAIN,
        WIDTH,
        "Days between episodes"
    ));

    // Create axes
    activeScollableEntities.add(new NumberAxis(
        TIMELINE_GROUP_START_X + 20,
        bodyStartY,
        endScaleX - startScaleX + barWidth,
        xScale,
        0,
        maxDiff,
        50
    ));

    return new PVector(5, 30 * (i + 1) + bodyStartY);
}


void enterEpisodeTimeline () {
    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

    // Create and display differences
    PVector lastEnd = createPostingDifferencesDisplay();

    // Create yearly display
    activeScollableEntities.add(new Title(
        5,
        lastEnd.y,
        WIDTH,
        "Episodes by year"
    ));
    lastEnd = placeAllEpisodes(lastEnd.y + EPISODE_DIAMETER + 5);

    // Create slider
    curScrollSlider = new Slider(
        WIDTH - SCROLL_WIDTH,
        WIDTH,
        START_Y_MAIN + 1,
        HEIGHT - DETAILS_AREA_HEIGHT - 2,
        0,
        lastEnd.y + 50,
        HEIGHT - DETAILS_AREA_HEIGHT - START_Y_MAIN
    );
    activeNonScollableEntities.add(curScrollSlider);
}
