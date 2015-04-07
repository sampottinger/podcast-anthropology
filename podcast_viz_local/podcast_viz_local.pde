Slider curScrollSlider = null;
ArrayList<GraphicEntity> activeEntities = new ArrayList<GraphicEntity>();
boolean preventDefaultCursor = false;
boolean detailsAreaActive = false;


void setup () {
    TEXT_CONSTANTS = loadJSONObject("text.json");
    FONT_12 = loadFont("LeagueSpartan-Bold-12.vlw");
    FONT_14 = loadFont("LeagueSpartan-Bold-14.vlw");

    loadColors();
    loadDataset();
    loadGraphicEpisodes();
    size(WIDTH, HEIGHT);

    introPage = 1;
    introDirty = true;

    runIntroFirstPage();
    frameRate(25);
}


void draw () {
    updateIntro();

    preventDefaultCursor = false;
    highlightedEpisode = null;

    for (GraphicEntity entity : activeEntities) {
        entity.update();
    }

    background(BACKGROUND_COLOR);

    for (GraphicEntity entity : activeEntities) {
        entity.draw();
    }

    if (detailsAreaActive) {
        drawDetailsArea();
    }

    if (!preventDefaultCursor) {
        cursor(ARROW);
    }
}


void mousePressed () {
    for (GraphicEntity entity : activeEntities) {
        entity.onPress();
    }
}


void mouseReleased () {
    for (GraphicEntity entity : activeEntities) {
        entity.onRelease();
    }
}
