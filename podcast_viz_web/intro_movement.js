var introSampleEpisode;
var talEnd;
var talBubble;
var introDirty = true;
var introPage = 1;


var runIntroFirstPage = function () {
    var numLines = getTextLines("intro_body_1").length;
    numLines += getTextLines("intro_head_1").length;
    
    activeScollableEntities = [];
    activeScollableEntities.push(
        new DescriptionMessage("intro_head_1", "intro_body_1")
    );
    
    activeScollableEntities.push(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Next",
        {
            onPress: function () {
                introPage = 2;
                introDirty = true;
            }
        }
    ));

    var center = new p5.Vector(550, INTRO_TEXT_Y + 18 * (numLines + 12));
    introSampleEpisode = graphicEpisodes.get("This American Life")[0];
    introSampleEpisode.setIdlingStrategy(new CirclingIdlingStrategy(
        center,
        100,
        5000
    ));
    activeScollableEntities.push(introSampleEpisode);
};


var runIntroSecondPage = function () {
    detailsAreaActive = true;

    var numLines = getTextLines("intro_body_2").length;
    numLines += getTextLines("intro_head_2").length;
    
    activeScollableEntities = [];
    activeScollableEntities.push(
        new DescriptionMessage("intro_head_2", "intro_body_2")
    );

    var center = new p5.Vector(500, INTRO_TEXT_Y + 18 * (numLines + 2));
    introSampleEpisode.goTo(center);
    introSampleEpisode.setIdlingStrategy(new CirclingIdlingStrategy(
        center,
        3,
        5000
    ));
    activeScollableEntities.push(introSampleEpisode);

    activeScollableEntities.push(new Button(
        800,
        INTRO_TEXT_Y + 18 * (numLines + 4),
        100,
        24,
        "Next",
        {
            onPress: function () { 
                introPage = 3;
                introDirty = true;
            }
        }
    ));
};


var placeEpisodeCluster = function (showName, centerPos) {
    var i = 0;
    var rowNum = 0;
    var finalVector = null;
    graphicEpisodes.get(showName).forEach(function (episode) {
        var newPos = new p5.Vector(
            i % INTRO_ROW_SIZE * 20,
            Math.floor(i / INTRO_ROW_SIZE) * 20
        );
        finalVector = newPos;
        i++;
        newPos.add(centerPos);
        episode.goTo(newPos);
    });

    return finalVector;
};


var runIntroThirdPage = function () {
    activeScollableEntities = [];
    activeScollableEntities.push(
        new DescriptionMessage("intro_head_3", "intro_body_3")
    );

    var center = new p5.Vector(70, 220);

    // Remove intro idling strategy
    var oldSamplePos = introSampleEpisode.getPos();
    introSampleEpisode.setIdlingStrategy(null);

    // Place all of the episodes
    talEnd = placeEpisodeCluster("This American Life", center);
    graphicEpisodes.get("This American Life").forEach(function (episode) {
        episode.setPos(center);
        activeScollableEntities.push(episode);
    });

    introSampleEpisode.setPos(oldSamplePos);

    // Place the show
    talBubble = new ShowBubble(
        new p5.Vector(center.x - 40, center.y + 10),
        curDataset.getShows().get("This American Life")
    );
    activeScollableEntities.push(talBubble);

    // Add next button
    var numLines = getTextLines("intro_body_3").length;
    numLines += getTextLines("intro_head_3").length;
    activeScollableEntities.push(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Next",
        {
            onPress: function () {
                introPage = 4;
                introDirty = true;
            }
        }
    ));
};


var runIntroFourthPage = function () {
    var showBubble;

    activeScollableEntities = [];
    activeScollableEntities.push(
        new DescriptionMessage("intro_head_4", "intro_body_4")
    );

    // Place this american life
    graphicEpisodes.get("This American Life").forEach(function (episode) {
        activeScollableEntities.push(episode);
    });
    activeScollableEntities.push(talBubble);

    // Place the rest
    var lastEnd = talEnd;
    for (var i=1; i<ORDERED_SHOW_NAMES.length; i++) {
        var center = new p5.Vector(70, lastEnd.y + INTER_SUMMARY_GRP_PAD);

        var showName = ORDERED_SHOW_NAMES[i];
        lastEnd = placeEpisodeCluster(showName, center);
        graphicEpisodes.get(showName).forEach(function (episode) {
            episode.setPos(center);
            activeScollableEntities.push(episode);
        });

        showBubble = new ShowBubble(
            new p5.Vector(center.x - 40, center.y + 10),
            curDataset.getShows().get(showName)
        );
        activeScollableEntities.push(showBubble);
    } 

    // Add next button
    var numLines = getTextLines("intro_body_4").length;
    numLines += getTextLines("intro_head_4").length;
    activeScollableEntities.push(new Button(
        800,
        INTRO_TEXT_Y + 18 * numLines,
        100,
        24,
        "Finish",
        {
            onPress: function () {
                introPage = 5;
                introDirty = true;
            }
        }
    ));   
};


var runIntroFinalPage = function () {
    activeNonScollableEntities = [];
    activeScollableEntities = [];
    navActive = true;

    var lastEnd = new p5.Vector(0, START_Y_MAIN - 50);
    for (var i=0; i<ORDERED_SHOW_NAMES.length; i++) {
        var center = new p5.Vector(70, lastEnd.y + INTER_SUMMARY_GRP_PAD);

        var showName = ORDERED_SHOW_NAMES[i];
        lastEnd = placeEpisodeCluster(showName, center);
        graphicEpisodes.get(showName).forEach(function (episode) {
            activeScollableEntities.push(episode);
        });

        showBubble = new ShowBubble(
            new p5.Vector(center.x - 40, center.y + 10),
            curDataset.getShows().get(showName)
        );
        activeScollableEntities.push(showBubble);
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
    activeNonScollableEntities.push(curScrollSlider);

    createNavArea();
};


function CirclingIdlingStrategy (newCenterPos, newRadius, newNumMillis) {
    // Private vars
    var radius;
    var numMillis;
    var startMillis;
    var started;
    var centerPos;

    // Method declarations
    var update = function (target) {
        if (!started) {
            startMillis = millis();
            started = true;
        }

        var millisDiff = millis() - startMillis;
        var rotations = millisDiff / numMillis;

        var retVector = new p5.Vector(-radius, 0);
        retVector.rotate(2 * PI * rotations);
        retVector.add(centerPos);
        target.setPos(retVector);
    };

    // Init
    radius = newRadius;
    numMillis = newNumMillis;
    started = false;
    
    centerPos = new p5.Vector(newCenterPos.x, newCenterPos.y);
    centerPos.sub(new p5.Vector(-radius, 0));

    // Attach public members
    this.update = update;
}


function DescriptionMessage (newIntroKey, newBodyKey) {
    // Private members
    var introKey;
    var bodyKey;

    // Method declarations
    var update = function (x, y) {};

    var draw = function () {
        push();

        smooth();
        noStroke();
        textSize(14);

        var conclLines = getTextLines(introKey);
        var numConclLines = conclLines.length;
        fill(NEAR_BLACK);
        for (var concLineNum = 0; concLineNum < numConclLines; concLineNum++) {
            text(
                conclLines[concLineNum],
                INTRO_TEXT_X, INTRO_TEXT_Y + concLineNum * 18
            );
        }

        var introLines = getTextLines(bodyKey);
        var introNumLines = introLines.length;
        fill(MID_GREY);
        for (var inLineNum = 0; inLineNum < introNumLines; inLineNum++) {
            text(
                introLines[inLineNum],
                INTRO_TEXT_X, INTRO_TEXT_Y + (inLineNum + numConclLines) * 18
            );
        }

        pop();
    };

    var onRelease = function (localMouseX, localMouseY) { };

    var onPress = function (localMouseX, localMouseY) { };

    // Init
    introKey = newIntroKey;
    bodyKey = newBodyKey;

    // Attach public members
    this.update = update;
    this.draw = draw;
    this.onRelease = onRelease;
    this.onPress = onPress;
}


var updateIntro = function () {
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
};
