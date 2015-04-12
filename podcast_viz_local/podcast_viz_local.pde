Slider curScrollSlider = null;

ArrayList<GraphicEntity> activeScollableEntities = new ArrayList<GraphicEntity>();
ArrayList<GraphicEntity> activeNonScollableEntities = new ArrayList<GraphicEntity>();
ArrayList<GraphicEntity> navBarEntities = new ArrayList<GraphicEntity>();

boolean preventDefaultCursor = false;
boolean detailsAreaActive = false;
boolean navActive = false;
NavSection selectedSection = NavSection.INTRO;

float adjustedMouseX;
float adjustedMouseY;


void setup () {
    loadSemiConstants();

    loadColors();
    loadDataset();
    loadGraphicEpisodes();
    size(WIDTH, HEIGHT);

    introPage = 1;
    introDirty = true;

    runIntroFirstPage();
    frameRate(30);
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
        entity.update(int(adjustedMouseX), int(adjustedMouseY));
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.update(mouseX, mouseY);
    }

    for (GraphicEntity entity : navBarEntities) {
        entity.update(mouseX, mouseY);
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

    for (GraphicEntity entity : navBarEntities) {
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
        entity.onPress(int(adjustedMouseX), int(adjustedMouseY));
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.onPress(mouseX, mouseY);
    }

    for (GraphicEntity entity : navBarEntities) {
        entity.onPress(mouseX, mouseY);
    }
}


void mouseReleased () {
    for (GraphicEntity entity : activeScollableEntities) {
        entity.onRelease(int(adjustedMouseX), int(adjustedMouseY));
    }

    for (GraphicEntity entity : activeNonScollableEntities) {
        entity.onRelease(mouseX, mouseY);
    }

    for (GraphicEntity entity : navBarEntities) {
        entity.onRelease(mouseX, mouseY);
    }
}
