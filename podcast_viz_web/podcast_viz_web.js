var curScrollSlider = null;

var activeScollableEntities = [];
var activeNonScollableEntities = [];
var navBarEntities = [];

var preventDefaultCursor = false;
var detailsAreaActive = false;
var navActive = false;
var loaded = false;
var selectedSection = NavSection.INTRO;

var adjustedMouseX;
var adjustedMouseY;

var dataSources;


var setupCallback = function () {
    loadSemiConstants();

    loadColors();
    loadDataset();
    loadGraphicEpisodes();

    introPage = 1;
    introDirty = true;

    runIntroFirstPage();

    loaded = true;
};


var draw = function () {
    if (!loaded) {
        return;
    }
    updateIntro();

    adjustedMouseX = mouseX;
    if (curScrollSlider === null) {
        adjustedMouseY = mouseY;
    } else {
        adjustedMouseY = mouseY + curScrollSlider.getVal();
    }

    preventDefaultCursor = false;
    highlightedEpisode = null;
    curBottomText = null;

    activeScollableEntities.forEach(function (entity) {
        entity.update(int(adjustedMouseX), int(adjustedMouseY));
    });

    activeNonScollableEntities.forEach(function (entity) {
        entity.update(mouseX, mouseY);
    });

    navBarEntities.forEach(function (entity) {
        entity.update(mouseX, mouseY);
    });

    background(BACKGROUND_COLOR);

    push();
    if (curScrollSlider !== null) {
        translate(0, -curScrollSlider.getVal());
    }

    activeScollableEntities.forEach(function (entity) {
        entity.draw();
    });
    pop();

    activeNonScollableEntities.forEach(function (entity) {
        entity.draw();
    });

    navBarEntities.forEach(function (entity) {
        entity.draw();
    });

    if (detailsAreaActive) {
        drawDetailsArea();
    }

    if (!preventDefaultCursor) {
        cursor(ARROW);
    }
};


var mousePressed = function () {
    activeScollableEntities.forEach(function (entity) {
        entity.onPress(int(adjustedMouseX), int(adjustedMouseY));
    });

    activeNonScollableEntities.forEach(function (entity) {
        entity.onPress(mouseX, mouseY);
    });

    navBarEntities.forEach(function (entity) {
        entity.onPress(mouseX, mouseY);
    });
};


var mouseReleased = function () {
    activeScollableEntities.forEach(function (entity) {
        entity.onRelease(int(adjustedMouseX), int(adjustedMouseY));
    });

    activeNonScollableEntities.forEach(function (entity) {
        entity.onRelease(mouseX, mouseY);
    });

    navBarEntities.forEach(function (entity) {
        entity.onRelease(mouseX, mouseY);
    });
};


var mouseWheel = function(event) {
    if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT) {
        var e = event.detail? event.detail*(-120) : event.wheelDelta;
        e /= 10;
        if (curScrollSlider) {
            curScrollSlider.addVal(e);
        }

        event.preventDefault();
    }
};


var preloadData = function (callback) {
    dataSources = {};
    var datasetLoaded = false;
    var textLoaded = false;
    var colorsLoaded = false;
    
    loadJSON("/data/" + DATASET_JSON_LOC, function (dataset) {
        dataSources[DATASET_JSON_LOC] = dataset;
        datasetLoaded = true;
        tryToMove();
    });
    
    loadJSON("/data/" + TEXT_SOURCE_LOC, function (textSource) {
        dataSources[TEXT_SOURCE_LOC] = textSource;
        textLoaded = true;
        tryToMove();
    });

    loadJSON("/data/show_colors.json", function (showColors) {
        dataSources["show_colors.json"] = showColors;
        colorsLoaded = true;
        tryToMove();
    });

    var tryToMove = function () {
        if (datasetLoaded && textLoaded && colorsLoaded) {
            callback();
        }
    }
};

var setup = function () {
    createCanvas(WIDTH, HEIGHT);
    frameRate(30);
    preloadData(setupCallback);
    textFont("League Spartan");
};
