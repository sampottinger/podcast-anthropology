import java.util.Collections;

HashMap<String, PVector> topicMovementCenters;
HashMap<String, PVector> topicPositions;
String selectedTopic = null;
boolean topicsDisplayDirty = true;


void createTopicShowSources () {
    // Place shows
    int y = START_Y_MAIN + 60;
    topicMovementCenters = new HashMap<String, PVector>();
    for (String showName : ORDERED_SHOW_NAMES) {
        topicMovementCenters.put(showName, new PVector(30, y));
        y += 100;
    }

    // Create show sources
    PVector lastEnd = new PVector(0, START_Y_MAIN - 50);
    for (String showName : ORDERED_SHOW_NAMES) {
        PVector center = topicMovementCenters.get(showName);

        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            PVector episodeCenter = new PVector(center.x + 50, center.y);
            episode.goTo(episodeCenter);
            activeNonScollableEntities.add(episode);
        }

        ShowBubble showBubble = new ShowBubble(
            new PVector(center.x, center.y),
            curDataset.getShows().get(showName)
        );
        activeNonScollableEntities.add(showBubble);
    }
}


ArrayList<CachedTopic> createCachedTopics () {
    ArrayList<CachedTopic> retList = new ArrayList<CachedTopic>();

    for (String topic : topicSet) {
        int overlap = curCoocurranceMatrix.getPairSize(topic, topic);
        retList.add(new CachedTopic(topic, overlap));
    }

    Collections.sort(retList);
    Collections.reverse(retList);

    return retList;
}


PVector createTopicDisplays () {
    PVector newPos = null;
    ArrayList<CachedTopic> cachedTopics = createCachedTopics();
    ArrayList<GraphicEntity> entities = new ArrayList<GraphicEntity>();
    topicPositions = new HashMap<String, PVector>();

    int maxCount = cachedTopics.get(0).getCount();
    LinearScale barScale = new LinearScale(0, maxCount, 0, 90);

    int x = WIDTH - 350;
    int y = START_Y_MAIN + 10;
    for (CachedTopic topic : cachedTopics) {
        newPos = new PVector(x, y);
        GraphicalTopic newGraphic = new GraphicalTopic(topic, barScale, newPos);
        entities.add(newGraphic);
        topicPositions.put(topic.getTopic(), new PVector(x, y));
        y += 14;
    }

    EntityRegion region = new EntityRegion(entities);
    region.setMinX(x - 100);
    region.setMaxX(x + 100);
    region.setMinY(START_Y_MAIN);
    activeScollableEntities.add(region);

    return newPos;
}


void createArcs (float newHeight) {
    LinearScale overlapScale = new LinearScale(0.08, 1, 1, 20);
    ArrayList<OverlapArc> arcsToCache = new ArrayList<OverlapArc>();

    for (String topic1 : topicSet) {
        for (String topic2 : topicSet) {
            float giniVal = curCoocurranceMatrix.getGini(topic1, topic2);
            int overlapSize = curCoocurranceMatrix.getPairSize(topic1, topic2);
            if (overlapSize > 1 && giniVal > 0.08 && topic1.compareTo(topic2) < 0) {
                arcsToCache.add(new OverlapArc(
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

    activeScollableEntities.add(new CachedArcs(0, 0, newHeight, arcsToCache));
}


void enterTopicMovement () {
    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

    createTopicShowSources();
    PVector endPos = createTopicDisplays();
    createArcs(endPos.y);

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
    activeNonScollableEntities.add(curScrollSlider);
}


void selectTopic (String topic) {
    int i = 0;
    for (String showName : ORDERED_SHOW_NAMES) {
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            PVector center = topicMovementCenters.get(showName);
            episode.goTo(new PVector(
                center.x,
                center.y
            ));
        }
    }

    for (EpisodeGraphic episode : curCoocurranceMatrix.getPair(topic, topic)) {
        int xNum = i % 10;
        int yNum = i / 10;
        int x = xNum * EPISODE_DIAMETER + 150;
        int y = yNum * EPISODE_DIAMETER + START_Y_MAIN + 20;
        episode.goTo(new PVector(x, y));
        i++;
    }
}
