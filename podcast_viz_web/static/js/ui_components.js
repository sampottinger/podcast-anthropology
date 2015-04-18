/**
 * Common UI elements used across the podcast anthrpology visualization.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Event listener for when a button is pressed.
 *
 * @typedef {Object} ButtonListener
 * @property {function} onPress - Function without return value or parameters
 *      called when the button is pressed.
 */


/**
 * Event listener for when a button is hovered over by the user's cursor..
 *
 * @typedef {Object} HoverListener
 * @property {function} hovering - Function without return value or parameters
 *      called when the button is hovered.
 */


/**
 * Simple push button.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newX - The x coordiante of the left side of the button.
 * @param {Number} newY - The y coordinate of the top of the button.
 * @param {Number} newWidth - The width of the button in pixels.
 * @param {Number} newHeight - The height of the button in pixels.
 * @param {String} newText - The text to appear on the body of the button.
 * @param {ButtonListener} newListener - Listener to call when the button is
 *      pressed.
 */
function Button (newX, newY, newWidth, newHeight, newText, newListener) {

    // -- Private vars --
    var startX;
    var startY;
    var buttonWidth;
    var buttonHeight;
    var hovering;
    var buttonText;
    var listener;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        var isOutside = false;
        isOutside = isOutside || (localMouseX < startX);
        isOutside = isOutside || (localMouseX > startX + buttonWidth);
        isOutside = isOutside || (localMouseY < startY);
        isOutside = isOutside || (localMouseY > startY + buttonHeight);
        hovering = !isOutside;
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        if (hovering && listener !== null) {
            listener.onPress();
        }
    };

    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {};

    // -- Constructor --
    startX = newX;
    startY = newY;
    buttonWidth = newWidth;
    buttonHeight = newHeight;
    hovering = false;
    buttonText = newText;
    listener = newListener;

    // -- Attach public members --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Simple graphic trying to show that the nav bar is interact-able.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newX - The x coordinate of the flasher.
 * @param {Number} newY - The y coordinate of the flasher.
 */
function NavFlasher(newX, newY) {

    // -- Private vars --
    var x;
    var y;
    var curFlashLoc;

    // -- Method declarations --
    
    /**
     * @inheritDoc
     */
    var draw = function() {
        push();

        noStroke();

        fill(NEAR_BLACK);
        textSize(12);
        text("Navigation:", x, y);

        rectMode(CORNER);
        rect(x + curFlashLoc, y + 3, 5, 2);

        pop();
    };

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        curFlashLoc = curFlashLoc + 1;
        curFlashLoc %= 70;
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {};
    
    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {};

    // -- Constructor --
    x = newX;
    y = newY;
    curFlashLoc = 0;

    // -- Attach public members --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Button appearing in the navigation bar at the top of the visualization.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newStartX - The x coordinate in pixels of the left side of
 *      this button.
 * @param {Number} newStartY - The y coordinate in pixels of the top of this
 *      button.
 * @param {Number} newWidth - The width of this button in pixels.
 * @param {String} newText - The text to appear upon this button.
 * @param {ButtonListener} newListener - Listener to call when the button
 *      is pressed.
 */
function NavButton (newStartX, newStartY, newWidth, newText, newListener) {

    // -- Private vars --
    var hovering;
    var selected;
    var startX;
    var startY;
    var buttonWidth;
    var lines;
    var listener;

    // -- Method declarations --

    /**
     * Indicate if this button should display as selected or not.
     *
     * @param {boolean} newState - Flag indicating if this button should display
     *      as having been selected or not.
     */
    var setSelected = function(newState) {
        selected = newState;
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        hovering = localMouseY < START_Y_MAIN;
        hovering = hovering && localMouseY > startY;
        hovering = hovering && localMouseX > startX;
        hovering = hovering && localMouseX < (startX + buttonWidth);
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        if (hovering && listener !== null) {
            listener.onPress();
        }
    };

    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {};

    // -- Constructor --
    startX = newStartX;
    startY = newStartY;
    buttonWidth = newWidth;
    lines = newText.split("\n");
    listener = newListener;

    // -- Attach public members --
    this.setSelected = setSelected;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Simple rectangle that can respond to mouse hover events.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newStartX - The x coordinate in pixels of this rectangle's
 *      left side.
 * @param {Number} newStartY - The y coordinate in pixels of this rectangle's
 *      top.
 * @param {Number} newWidth - The width of this rectangle in pixels.
 * @param {Number} newHeight - The height of this rectangle in pixels.
 * @param {p5js.color} newColor - The color of htis rectangle when not being
 *      hovered.
 * @param {p5js.color} newColor - The color of htis rectangle when the user is
 *      hovering upon the graphic.
 */
function StaticRect (newStartX, newStartY, newWidth, newHeight, newColor,
    newHoverColor) {

    // -- Private vars --
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

    // -- Method declarations --

    /**
     * Update the listener to call if the user hovers upon this rectangle.
     *
     * @param {HoverListener} newListener - Listener to inform when the
     *      rectangle is hovered over.
     */
    var setHoverListener = function(newListener) {
        hoverListener = newListener;
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
        push();

        rectMode(CORNER);
        noStroke();
        fill(inRegion ? hoverColor : rectColor);
        rect(startX, startY, rectWidth, rectHeight);

        pop();
    };

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {

        inRegion = (localMouseX >= hoverStartX);
        inRegion = inRegion && (localMouseX <= hoverEndX);
        inRegion = inRegion && (localMouseY >= hoverStartY);
        inRegion = inRegion && (localMouseY <= hoverEndY);

        if (inRegion && hoverListener !== null) {
            hoverListener.hovering();
        }
    };

    /**
     * @inheritDoc
     */
    var onPress = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function(x, y) { };

    // -- Constructor --
    startX = newStartX;
    startY = newStartY;
    rectWidth = newWidth;
    rectHeight = newHeight;
    rectColor = newColor;
    hoverColor = newHoverColor === undefined ? newColor : newHoverColor;

    var endX = startX + rectWidth;
    var endY = startY + rectHeight;

    hoverStartX = min(startX, endX);
    hoverStartY = min(startY, endY) - 5;
    hoverEndX = max(startX, endX);
    hoverEndY = max(startY, endY);

    inRegion = false;

    hoverListener = null;

    // -- Attach public members --
    this.setHoverListener = setHoverListener;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Simple text element acting as a title to section within the visualization.
 *
 * @constructor
 * @impelements {GraphicEntity}
 * @param {Number} newX - The x coordinate in pixels of the left side of the
 *      title.
 * @param {Number} newY - The y coordinate in pixels of the top of the title.
 * @param {Number} newWidth - The width of the title in pixels.
 * @param {String} newContent - The text to display within the title.
 */
function Title (newX, newY, newWidth, newContent) {

    // -- Private vars --
    var x;
    var y;
    var titleWidth;
    var content;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    /**
     * @inheritDoc
     */
    var update = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onPress = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function(x, y) { };

    // -- Constructor --
    x = newX;
    y = newY;
    titleWidth = newWidth;
    content = newContent;

    // -- Attach public members --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Region in which mouse events are propogated.
 *
 * Region of {GraphicEntities} that stops propogation of mouse events unless the
 * user's cursor appears within region, increasing efficiency of mouse event
 * propogation.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Array<GraphicEntity>} newEntities - The entities within the region.
 */
function EntityRegion(newEntities) {
    
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

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var draw = function() {
        entities.forEach(function(entity) {
            entity.draw();
        });
    };

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        if (!active) {
            return;
        }

        inRegion = (!minXSet || (localMouseX > minX));
        inRegion = inRegion && (!maxXSet || (localMouseX < maxX));
        inRegion = inRegion && (!minYSet || (localMouseY > minY));
        inRegion = inRegion && (!maxYSet || (localMouseY < maxY));

        if (inRegion || prevInRegion) {
            entities.forEach(function(entity) {
                entity.update(localMouseX, localMouseY);
            });
        }

        prevInRegion = inRegion;
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {
        update(localMouseX, localMouseY);

        if (inRegion) {
            entities.forEach(function(entity) {
                entity.onPress(localMouseX, localMouseY);
            });
        }
    };

    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {
        if (inRegion) {
            entities.forEach(function(entity) {
                entity.onRelease(localMouseX, localMouseY);
            });
        }
    };

    /**
     * Set the minimum x value covered by this region's bounding box.
     *
     * @param {Number} newMinX - The new x coordinate in pixels of the region's
     *      bouding box's left hand side.
     */
    var setMinX = function(newMinX) {
        minX = newMinX;
        minXSet = true;
    };

    /**
     * Set the minimum y value covered by this region's bounding box.
     *
     * @param {Number} newMinX - The new y coordinate in pixels of the region's
     *      bouding box's top side.
     */
    var setMinY = function(newMinY) {
        minY = newMinY;
        minYSet = true;
    };

    /**
     * Set the maximum x value covered by this region's bounding box.
     *
     * @param {Number} newMaxX - The new x coordinate in pixels of the region's
     *      bouding box's right hand side.
     */
    var setMaxX = function(newMaxX) {
        maxX = newMaxX;
        maxXSet = true;
    };

    /**
     * Set the minimum y value covered by this region's bounding box.
     *
     * @param {Number} newMaxY - The new y coordinate in pixels of the region's
     *      bouding box's lower side.
     */
    var setMaxY = function(newMaxY) {
        maxY = newMaxY;
        maxYSet = true;
    };

    /**
     * Indicate if this region is active or not.
     *
     * @param {boolean} newActive - Flag indicating if this region should
     *      propogate events or not. True will start event propogation fired
     *      when the user's cursor is within the region and False will stop
     *      event propogation even if the user's cursor appears in the region.
     */
    var setActive = function(newActive) {
        active = newActive;
    };

    // -- Constructor --
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

    // -- Attach public members --
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
