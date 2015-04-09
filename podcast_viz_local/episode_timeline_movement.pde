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
    int numAggregators = aggregators.size();
    for (int i = numAggregators - 1; i >= 0; i--) {
        DateAggregationCategory aggregator = aggregators.get(i);
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


float createPostingDifferencesDisplay (float startY,
    AggregationBarChartProto proto) {

    HashMap<String, Aggregator> differences;
    differences = new HashMap<String, Aggregator>();

    int i;
    float bodyStartY = startY + 18;

    // Place legends and calculate aggregates
    i = 1;
    for (String showName : ORDERED_SHOW_NAMES) {
        float y = 30 * i + bodyStartY;

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

    // Create graphics
    proto.setAggSettings(differences, 5, 50, true);
    proto.setYCoord(bodyStartY);
    proto.setText("0%", "50%", "Days between episodes");

    AggregationBarChart barChart = new AggregationBarChart(proto);
    activeScollableEntities.add(barChart);

    return barChart.getEndY();
}


void enterEpisodeTimeline () {
    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

    // Finds bounds for embedded bar charts
    float startScaleX = TIMELINE_GROUP_START_X + 20;
    float endScaleX = WIDTH - 50 - TIMELINE_GROUP_START_X;
    AggregationBarChartProto proto = new AggregationBarChartProto();
    proto.setXCoord(startScaleX, endScaleX);

    // Create and display differences
    PVector lastEnd = new PVector(
        0,
        createPostingDifferencesDisplay(START_Y_MAIN, proto)
    );

    // Create yearly display
    activeScollableEntities.add(new Title(
        5,
        lastEnd.y,
        WIDTH,
        "Detailed episodes by year"
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
