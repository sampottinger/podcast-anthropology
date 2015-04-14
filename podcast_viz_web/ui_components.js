function Button (newX, newY, newWidth, newHeight, newText, newListener) {
    // Private vars
    var startX;
    var startY;
    var buttonWidth;
    var buttonHeight;
    var hovering;
    var buttonText;
    var listener;

    // Method declarations
    var draw = function () {
        push();

        if (hovering) {
            preventDefaultCursor = true;
            cursor(HAND);
        }

        rectMode(CORNER);
        noStroke();
        fill(hovering ? NEAR_BLACK : DARK_GREY);
        rect(startX, startY, buttonWidth, buttonHeight);

        fill(WHITE);
        textAlign(CENTER);
        textSize(12);
        text(
            buttonText,
            startX + buttonWidth / 2,
            startY + buttonHeight / 2 + 5
        );

        pop();
    };

    var update = function (localMouseX, localMouseY) {
        var isOutside = false;
        isOutside = isOutside || (localMouseX < startX);
        isOutside = isOutside || (localMouseX > startX + buttonWidth);
        isOutside = isOutside || (localMouseY < startY);
        isOutside = isOutside || (localMouseY > startY + buttonHeight);
        hovering = !isOutside;
    };

    var onPress = function (localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        if (hovering && listener !== null) {
            listener.onPress();
        }
    };

    var onRelease = function (localMouseX, localMouseY) {};

    // Init
    startX = newX;
    startY = newY;
    buttonWidth = newWidth;
    buttonHeight = newHeight;
    hovering = false;
    buttonText = newText;
    listener = newListener;

    // Attach public members
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function NavFlasher (newX, newY) {
    // Private vars
    var x;
    var y;
    var curFlashLoc;

    // Method declarations
    var draw = function () {
        push();

        noStroke();

        fill(NEAR_BLACK);
        textSize(12);
        text("Navigation:", x, y);

        rectMode(CORNER);
        rect(x + curFlashLoc, y + 3, 5, 2);

        pop();
    };

    var update = function (localMouseX, localMouseY) {
        curFlashLoc = curFlashLoc + 1;
        curFlashLoc %= 70;
    };

    var onPress = function (localMouseX, localMouseY) {};
    var onRelease = function (localMouseX, localMouseY) {};

    // Init
    x = newX;
    y = newY;
    curFlashLoc = 0;

    // Attach public members
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function NavButton (newStartX, newStartY, newWidth, newText, newListener) {
    // Private vars
    var hovering;
    var selected;
    var startX;
    var startY;
    var buttonWidth;
    var lines;
    var listener;

    // Method declarations
    var setSelected = function (newState) {
        selected = newState;
    };

    var draw = function () {
        push();

        if (hovering) {
            preventDefaultCursor = true;
            cursor(HAND);
        }

        textSize(14);
        noStroke();
        fill(selected || hovering ? NEAR_BLACK : MID_GREY);
        if (lines.length == 1) {
            text(lines[0], startX, startY + 30);
        } else {
            text(lines[0], startX, startY + 15);
            text(lines[1], startX, startY + 30);
        }

        if (selected) {
            rectMode(CORNER);
            rect(startX, startY + 34, buttonWidth, 5);
        }

        pop();
    };

    var update = function (localMouseX, localMouseY) {
        hovering = localMouseY < START_Y_MAIN;
        hovering = hovering && localMouseY > startY;
        hovering = hovering && localMouseX > startX;
        hovering = hovering && localMouseX < (startX + buttonWidth);
    };

    var onPress = function (localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        if (hovering && listener !== null) {
            listener.onPress();
        }
    };

    var onRelease = function (localMouseX, localMouseY) {};

    // Init
    startX = newStartX;
    startY = newStartY;
    buttonWidth = newWidth;
    lines = newText.split("\n");
    listener = newListener;

    // Attach public members
    this.setSelected = setSelected;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function StaticRect (newStartX, newStartY, newWidth, newHeight, newColor) {
    // Private vars
    var startX;
    var startY;
    var hoverEndX;
    var hoverEndY;
    var hoverStartX;
    var hoverStartY;
    var rectWidth;
    var rectHeight;
    var rectColor;
    var hoverColor;
    var hoverListener;
    var inRegion;

    // Method declarations
    var setHoverListener = function (newListener) {
        hoverListener = newListener;
    };

    var draw = function () {
        push();

        rectMode(CORNER);
        noStroke();
        fill(inRegion ? hoverColor : rectColor);
        rect(startX, startY, rectWidth, rectHeight);

        pop();
    };

    var update = function (localMouseX, localMouseY) {

        inRegion = (localMouseX > hoverStartX);
        inRegion = inRegion && (localMouseX < hoverEndX);
        inRegion = inRegion && (localMouseY > hoverStartY);
        inRegion = inRegion && (localMouseY < hoverEndY);

        if (inRegion && hoverListener !== null) {
            hoverListener.hovering();
        }
    };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    // Init
    startX = newStartX;
    startY = newStartY;
    rectWidth = newWidth;
    rectHeight = newHeight;
    rectColor = newColor;
    hoverColor = newColor;

    var endX = startX + rectWidth;
    var endY = startY + rectHeight;

    hoverStartX = min(startX, endX);
    hoverStartY = min(startY, endY) - 5;
    hoverEndX = max(startX, endX);
    hoverEndY = max(startY, endY);

    inRegion = false;

    hoverListener = null;

    // Attach public members
    this.setHoverListener = setHoverListener;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function Title (newX, newY, newWidth, newContent) {
    // Private vars
    var x;
    var y;
    var titleWidth;
    var content;

    // Method declarations
    var draw = function () {
        push();

        rectMode(CORNER);
        noStroke();
        fill(MID_GREY);

        rect(x, y + 15, titleWidth, 1);

        textSize(14);
        textAlign(LEFT);
        text(content, x, y + 14);

        pop();
    };

    var update = function (x, y) { };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    // Init
    x = newX;
    y = newY;
    titleWidth = newWidth;
    content = newContent;

    // Attach public members
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function EntityRegion (newEntities) {
    // Private vars
    var minXSet;
    var minYSet;
    var maxXSet;
    var maxYSet;

    var inRegion;
    var prevInRegion;

    var minX;
    var minY;
    var maxX;
    var maxY;

    var active;

    var entities;

    // Method declarations
    var draw = function () {
        entities.forEach(function (entity) {
            entity.draw();
        });
    };

    var update = function (localMouseX, localMouseY) {
        if (!active) {
            return;
        }

        inRegion = (!minXSet || (localMouseX > minX));
        inRegion = inRegion && (!maxXSet || (localMouseX < maxX));
        inRegion = inRegion && (!minYSet || (localMouseY > minY));
        inRegion = inRegion && (!maxYSet || (localMouseY < maxY));

        if (inRegion || prevInRegion) {
            entities.forEach(function (entity) {
                entity.update(localMouseX, localMouseY);
            });
        }

        prevInRegion = inRegion;
    };

    var onPress = function (localMouseX, localMouseY) {
        update(localMouseX, localMouseY);

        if (inRegion) {
            entities.forEach(function (entity) {
                entity.onPress(localMouseX, localMouseY);
            });
        }
    };

    var onRelease = function (localMouseX, localMouseY) {
        if (inRegion) {
            entities.forEach(function (entity) {
                entity.onRelease(localMouseX, localMouseY);
            });
        }
    };

    var setMinX = function (newMinX) {
        minX = newMinX;
        minXSet = true;
    };

    var setMinY = function (newMinY) {
        minY = newMinY;
        minYSet = true;
    };

    var setMaxX = function (newMaxX) {
        maxX = newMaxX;
        maxXSet = true;
    };

    var setMaxY = function (newMaxY) {
        maxY = newMaxY;
        maxYSet = true;
    };

    var setActive = function (newActive) {
        active = newActive;
    };

    // Init
    entities = newEntities;

    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;

    minXSet = false;
    minYSet = false;
    maxXSet = false;
    maxYSet = false;

    inRegion = false;
    prevInRegion = false;
    active = true;

    // Attach public members
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.setMinX = setMinX;
    this.setMinY = setMinY;
    this.setMaxX = setMaxX;
    this.setMaxY = setMaxY;
    this.setActive = setActive;
}
