Slider curScrollSlider = null;
ArrayList<GraphicEntity> activeScollableEntities = new ArrayList<GraphicEntity>();
ArrayList<GraphicEntity> activeNonScollableEntities = new ArrayList<GraphicEntity>();
boolean preventDefaultCursor = false;
boolean detailsAreaActive = false;

float adjustedMouseX;
float adjustedMouseY;


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

    adjustedMouseX = mouseX;
    if (curScrollSlider == null) {
        adjustedMouseY = mouseY;
    } else {
        adjustedMouseY = mouseY + curScrollSlider.getVal();
    }

    preventDefaultCursor = false;
    highlightedEpisode = null;

    for (GraphicEntity entity : activeScollableEntities) {
        entity.update();
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.update();
    }

    background(BACKGROUND_COLOR);

    pushMatrix();
    if (curScrollSlider != null) {
        translate(0, -curScrollSlider.getVal());
    }

    for (GraphicEntity entity : activeScollableEntities) {
        entity.draw();
    }
    popMatrix();

    for (GraphicEntity entity : activeNonScollableEntities) {
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
    for (GraphicEntity entity : activeScollableEntities) {
        entity.onPress();
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.onPress();
    }
}


void mouseReleased () {
    for (GraphicEntity entity : activeScollableEntities) {
        entity.onRelease();
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.onRelease();
    }
}
