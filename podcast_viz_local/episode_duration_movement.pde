ArrayList<AggregationCategory> createDurationAggregators () {
    ArrayList<AggregationCategory> retList;
    retList = new ArrayList<AggregationCategory>();

    int maxDuration = 0;
    for (String showName : ORDERED_SHOW_NAMES) {
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            int dur = episode.getEpisode().getDur();
            if (maxDuration < dur) {
                maxDuration = dur;
            }
        }
    }

    for (int i=0; i * 20 * 60<=maxDuration; i += 1) {
        retList.add(new DurationAggregationCategory(
            (i * 20) * 60 + 1,
            ((i + 1) * 20) * 60 + 1
        ));
    }

    return retList;
}


PVector placeAllEpisodesByDuration (float startY) {
    // Place episodes
    ArrayList<AggregationCategory> aggregators;
    aggregators = createDurationAggregators();
    
    for (String showName : ORDERED_SHOW_NAMES) {
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            for (AggregationCategory aggregator : aggregators) {
                aggregator.processEpisode(episode);
            }
            activeScollableEntities.add(episode);
        }
    }

    int aggNum = 0;
    PVector targetLoc = null;
    int maxY = 0;
    for (AggregationCategory aggregator : aggregators) {
        int innerGroupNum = 0;
        for (EpisodeGraphic episode : aggregator.getMatchedEpisodes()) {
            int targetX = EPISODE_DIAMETER * (innerGroupNum / 21);
            targetX += TIMELINE_GROUP_START_X;
            
            int targetY = aggNum * DURATION_GROUP_HEIGHT;
            targetY += startY;
            targetY += (innerGroupNum % 21) * EPISODE_DIAMETER;
            
            targetLoc = new PVector(targetX, targetY);
            episode.goTo(targetLoc);
            innerGroupNum++;
            maxY = maxY > targetY ? maxY : targetY;
        }
        aggNum++;
    }

    // Create legend
    ArrayList<String> labels = new ArrayList<String>();
    
    int i = 0;
    for (AggregationCategory aggregator : aggregators) {
        labels.add(str(i * 20 + 1) + "-" + str((i+1) * 20) + " min");
        i++;
    }
    
    ArrayList<SummaryLegend> legends = createAggCategoriesLegends(
        TIMELINE_GROUP_START_X - 23,
        startY + EPISODE_DIAMETER - 10,
        -100,
        aggregators,
        DURATION_GROUP_HEIGHT,
        labels
    );
    for (SummaryLegend legend : legends) {
        activeScollableEntities.add(legend);
    }

    return new PVector(0, maxY);
}


void enterEpisodeDurationView () {
    PVector lastEnd;

    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

    activeScollableEntities.add(new Title(
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
    activeNonScollableEntities.add(curScrollSlider);
}