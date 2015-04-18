/**
 * Main entry point for the podcast anthropology visualization.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


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


/**
 * Function to call after the visualization data has been downloaded.
 */
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


/**
 * Central loop draw function that performs ongoing calculations and redraws.
 */
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


/**
 * Callback for when the mouse button is pressed.
 */
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


/**
 * Callback function for when the mouse button is released.
 */
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


/**
 * Callback function for when the mouse wheel is incremented / updated.
 */
var mouseWheel = function(event) {
    if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT && navActive) {
        var e = event.detail? event.detail*(-120) : event.wheelDelta;
        e /= 10;
        e *= -1;
        if (curScrollSlider) {
            curScrollSlider.addVal(e);
        }

        event.preventDefault();
    }
};


/**
 * Load visualization data including colors and long string constants.
 *
 * @param {function} callback - Function without parameters or return value to
 *      call after visualization data has been loaded.
 */
var preloadData = function (callback) {
    dataSources = {};
    var datasetLoaded = false;
    var textLoaded = false;
    var colorsLoaded = false;
    
    loadJSON("/static/data/" + DATASET_JSON_LOC, function (dataset) {
        dataSources[DATASET_JSON_LOC] = dataset;
        datasetLoaded = true;
        tryToMove();
    });
    
    loadJSON("/static/data/" + TEXT_SOURCE_LOC, function (textSource) {
        dataSources[TEXT_SOURCE_LOC] = textSource;
        textLoaded = true;
        tryToMove();
    });

    loadJSON("/static/data/show_colors.json", function (showColors) {
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


/**
 * Initial setup routine that starts p5js and downloads source data.
 */
var setup = function () {
    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("main-viz-holder");
    frameRate(30);
    preloadData(setupCallback);
    textFont("League Spartan");
};
