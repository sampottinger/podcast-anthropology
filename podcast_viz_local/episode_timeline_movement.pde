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
    int i = 1;
    for (String showName : ORDERED_SHOW_NAMES) {
        activeScollableEntities.add(new TinyLegend(
            TIMELINE_GROUP_START_X,
            30 * i + START_Y_MAIN,
            showName,
            SHOW_COLORS.get(showName).getFill()
        ));
        i++;
    }

    return new PVector(5, 30 * (i + 1) + START_Y_MAIN);
}


void enterEpisodeTimeline () {
    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

    // Create and display differences
    PVector lastEnd = createPostingDifferencesDisplay();

    // Place elements
    lastEnd = placeAllEpisodes(lastEnd.y);

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
