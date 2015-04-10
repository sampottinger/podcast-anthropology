HashMap<String, PVector> topicMovementCenters;


void enterTopicMovement() {
    // Clear old elements
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    createNavArea();
    System.gc();

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
            activeScollableEntities.add(episode);
        }

        ShowBubble showBubble = new ShowBubble(
            new PVector(center.x, center.y),
            curDataset.getShows().get(showName)
        );
        activeScollableEntities.add(showBubble);
    }
}