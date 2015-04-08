EpisodeGraphic introSampleEpisode;
PVector talEnd;
ShowBubble talBubble;
boolean introDirty = true;
int introPage = 1;


void runIntroFirstPage () {
    int numLines = getTextLines("intro_body_1").length;
    numLines += getTextLines("intro_head_1").length;
    
    activeScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities.add(
        new DescriptionMessage("intro_head_1", "intro_body_1")
    );
    
    activeScollableEntities.add(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Next",
        new ButtonListener () {
            public void onPress () {
                introPage = 2;
                introDirty = true;
            }
        }
    ));

    PVector center = new PVector(550, INTRO_TEXT_Y + 18 * (numLines + 12));
    introSampleEpisode = graphicEpisodes.get("This American Life").get(0);
    introSampleEpisode.setIdlingStrategy(new CirclingIdlingStrategy(
        center,
        100,
        5000
    ));
    activeScollableEntities.add(introSampleEpisode);
}


void runIntroSecondPage () {
    detailsAreaActive = true;

    int numLines = getTextLines("intro_body_2").length;
    numLines += getTextLines("intro_head_2").length;
    
    activeScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities.add(
        new DescriptionMessage("intro_head_2", "intro_body_2")
    );

    PVector center = new PVector(500, INTRO_TEXT_Y + 18 * (numLines + 2));
    introSampleEpisode.goTo(center);
    introSampleEpisode.setIdlingStrategy(new CirclingIdlingStrategy(
        center,
        5,
        5000
    ));
    activeScollableEntities.add(introSampleEpisode);

    activeScollableEntities.add(new Button(
        800,
        INTRO_TEXT_Y + 18 * (numLines + 4),
        100,
        24,
        "Next",
        new ButtonListener () {
            public void onPress () { 
                introPage = 3;
                introDirty = true;
            }
        }
    ));
}


PVector placeEpisodeCluster (String showName, PVector centerPos) {
    int i = 0;
    int rowNum = 0;
    PVector finalVector = null;
    for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
        PVector newPos = new PVector(
            i % INTRO_ROW_SIZE * 20,
            i / INTRO_ROW_SIZE * 20
        );
        finalVector = newPos;
        i++;
        newPos.add(centerPos);
        episode.goTo(newPos);
    }

    return finalVector;
}


void runIntroThirdPage () {
    activeScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities.add(
        new DescriptionMessage("intro_head_3", "intro_body_3")
    );

    PVector center = new PVector(70, 220);

    // Remove intro idling strategy
    PVector oldSamplePos = introSampleEpisode.getPos();
    introSampleEpisode.setIdlingStrategy(null);

    // Place all of the episodes
    talEnd = placeEpisodeCluster("This American Life", center);
    for (EpisodeGraphic episode : graphicEpisodes.get("This American Life")) {
        episode.setPos(center);
        activeScollableEntities.add(episode);
    }

    introSampleEpisode.setPos(oldSamplePos);

    // Place the show
    talBubble = new ShowBubble(
        new PVector(center.x - 40, center.y + 10),
        curDataset.getShows().get("This American Life")
    );
    activeScollableEntities.add(talBubble);

    // Add next button
    int numLines = getTextLines("intro_body_3").length;
    numLines += getTextLines("intro_head_3").length;
    activeScollableEntities.add(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Next",
        new ButtonListener () {
            public void onPress () {
                introPage = 4;
                introDirty = true;
            }
        }
    ));
}


void runIntroFourthPage () {
    ShowBubble showBubble;

    activeScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities.add(
        new DescriptionMessage("intro_head_4", "intro_body_4")
    );

    // Place this american life
    for (EpisodeGraphic episode : graphicEpisodes.get("This American Life")) {
        activeScollableEntities.add(episode);
    }
    activeScollableEntities.add(talBubble);

    // Place the rest
    PVector lastEnd = talEnd;
    for (int i=1; i<ORDERED_SHOW_NAMES.length; i++) {
        PVector center = new PVector(70, lastEnd.y + INTER_SUMMARY_GRP_PAD);

        String showName = ORDERED_SHOW_NAMES[i];
        lastEnd = placeEpisodeCluster(showName, center);
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            episode.setPos(center);
            activeScollableEntities.add(episode);
        }

        showBubble = new ShowBubble(
            new PVector(center.x - 40, center.y + 10),
            curDataset.getShows().get(showName)
        );
        activeScollableEntities.add(showBubble);
    } 

    // Add next button
    int numLines = getTextLines("intro_body_4").length;
    numLines += getTextLines("intro_head_4").length;
    activeScollableEntities.add(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Finish",
        new ButtonListener () {
            public void onPress () {
                introPage = 5;
                introDirty = true;
            }
        }
    ));   
}


void runIntroFinalPage () {
    activeNonScollableEntities = new ArrayList<GraphicEntity>();
    activeScollableEntities = new ArrayList<GraphicEntity>();
    System.gc();
    navActive = true;

    PVector lastEnd = new PVector(0, START_Y_MAIN - 50);
    for (int i=0; i<ORDERED_SHOW_NAMES.length; i++) {
        PVector center = new PVector(70, lastEnd.y + INTER_SUMMARY_GRP_PAD);

        String showName = ORDERED_SHOW_NAMES[i];
        lastEnd = placeEpisodeCluster(showName, center);
        for (EpisodeGraphic episode : graphicEpisodes.get(showName)) {
            activeScollableEntities.add(episode);
        }

        ShowBubble showBubble = new ShowBubble(
            new PVector(center.x - 40, center.y + 10),
            curDataset.getShows().get(showName)
        );
        activeScollableEntities.add(showBubble);
    }

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

    createNavArea();
}


class CirclingIdlingStrategy implements IdlingStrategy {
    float radius;
    float numMillis;
    int startMillis;
    boolean started;
    PVector centerPos;

    CirclingIdlingStrategy (PVector newCenterPos, float newRadius,
        float newNumMillis) {

        radius = newRadius;
        numMillis = newNumMillis;
        started = false;
        
        centerPos = new PVector(newCenterPos.x, newCenterPos.y);
        centerPos.sub(new PVector(-radius, 0));
    }

    void update (EpisodeGraphic target) {
        if (!started) {
            startMillis = millis();
            started = true;
        }

        int millisDiff = millis() - startMillis;
        float rotations = millisDiff / numMillis;

        PVector retVector = new PVector(-radius, 0);
        retVector.rotate(2 * PI * rotations);
        retVector.add(centerPos);
        target.setPos(retVector);
    }
};


class DescriptionMessage implements GraphicEntity {
    private String introKey;
    private String bodyKey;

    DescriptionMessage (String newIntroKey, String newBodyKey) {
        introKey = newIntroKey;
        bodyKey = newBodyKey;
    }

    void update() {}

    void draw() {
        pushStyle();
        pushMatrix();

        smooth();
        noStroke();
        textFont(FONT_14);

        String[] conclLines = getTextLines(introKey);
        int numConclLines = conclLines.length;
        fill(NEAR_BLACK);
        for (int lineNum = 0; lineNum < numConclLines; lineNum++) {
            text(
                conclLines[lineNum],
                INTRO_TEXT_X, INTRO_TEXT_Y + lineNum * 18
            );
        }

        String[] introLines = getTextLines(bodyKey);
        int introNumLines = introLines.length;
        fill(MID_GREY);
        for (int lineNum = 0; lineNum < introNumLines; lineNum++) {
            text(
                introLines[lineNum],
                INTRO_TEXT_X, INTRO_TEXT_Y + (lineNum + numConclLines) * 18
            );
        }

        popStyle();
        popMatrix();
    }

    void onRelease () { }

    void onPress () { }
};


void updateIntro() {
    if (!introDirty) {
        return;
    }

    if (introPage == 1) {
        runIntroFirstPage();
    } else if (introPage == 2) {
        runIntroSecondPage();
    } else if (introPage == 3) {
        runIntroThirdPage();
    } else if (introPage == 4) {
        runIntroFourthPage();
    } else {
        runIntroFinalPage();
    }

    introDirty = false;
}
