/**
 * Structure and logic to drive a slider (can act as a scrollbar).
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Slider which can also double as a scollbar.
 *
 * UI widget which allows the user to select a number within a numerical range
 * and which can double as a scrollbar. Note that this will map input values
 * like a linear scaling function where the "number of pixels selected" is the
 * domain and the output value is between startMap and endMap.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newStartX - The x coordinate at which the left side of the
 *      widget should appear.
 * @param {Number} newEndX - The x coordinate to which the slider should extend.
 *      The bounding box for the widget will start at newStartX and end at
 *      this value.
 * @param {Number} newStartY - The y coordinate at which the top of this widget
 *      should appear.
 * @param {Number} newEndY - The y coordinate to which this widget should
 *      extend. The bounding box for the widget will start at newStartY and end
 *      at this value.
 * @param {Number} startMap - Treating the slider as a function that linearly
 *      scales from a number of pixels as a domain, this startMap is the minimum
 *      of the scaling function range.
 * @param {Number} endMap - Treating the slider as a function that linearly
 *      scales from a number of pixels as a domain, this endMap is the maximum
 *      of the scaling function range.
 * @param {Number} newVisible - The stating value (in the ouput range) for what
 *      is selected in the slider by default.
 */
function Slider(newStartX, newEndX, newStartY, newEndY, startMap, endMap,
    newVisible) {

    // -- Private vars --
    var pxToVal;
    var valToPx;
    var startX;
    var endX;
    var startY;
    var endY;
    var curVal;
    var curPos;
    var visibleAmt;
    var visiblePx;
    var active;
    var hovering;
    var maxVal;

    // -- Method declarations --

    /**
     * Determine whether or not the user's curosr is hovering over the widget.
     *
     * @private
     * @param {Number} localMouseX - The x coordinate of the user's cursor after
     *      taking the parent container's bounds and offsets into account (the
     *      cursor's position relative to the parent container).
     * @param {Number} localMouseY - The y coordinate of the user's cursor after
     *      taking the parent container's bounds and offsets into account (the
     *      cursor's position relative to the parent container).
     */
    var updateHovering = function(localMouseX, localMouseY) {
        hovering = localMouseX > startX;
        hovering = hovering && localMouseX < endX;
        hovering = hovering && localMouseY > startY;
        hovering = hovering && localMouseY < endY;
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {
        updateHovering(localMouseX, localMouseY);
        if (hovering) {
            active = true;
        }
    };

    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {
        active = false;
    };

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        updateHovering(localMouseX, localMouseY);
        if (!active) {
            return;
        }

        curPos = localMouseY - startY;
        if (curPos > endY - visiblePx) {
            curPos = endY - visiblePx;
        }
        if (curPos < startY) {
            curPos = startY;
        }

        curVal = pxToVal.scale(curPos);
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
        push();

        rectMode(CORNERS);
        noStroke();

        fill(WHITE);
        rect(startX, startY, endX, endY);

        fill(hovering || active ? MID_GREY : LIGHT_GREY);
        rect(startX, curPos, endX, curPos + visiblePx);

        pop();
    };

    /**
     * Get the value selected by the user in the slider.
     *
     * Get the value that the user has selected using the slider where the
     * "number of pixels" the user has selected has been converted to an output
     * range value.
     *
     * @return {Number} Range value the user has selected using the slider.
     */
    var getVal = function() {
        return curVal;
    };

    /**
     * Increment the selected value in the slide.
     *
     * @param {Number} delta - The value to add to the current selected range
     *      value shown in the slier.
     */
    var addVal = function(delta) {
        curVal += delta;
        curPos = valToPx.scale(curVal);
        
        if (curPos > endY - visiblePx) {
            curPos = endY - visiblePx;
        }
        if (curPos < startY) {
            curPos = startY;
        }

        curVal = pxToVal.scale(curPos);
    };

    // -- Constructor --
    startX = newStartX;
    endX = newEndX;
    startY = newStartY;
    endY = newEndY;
    active = false;
    maxVal = endMap;

    pxToVal = new LinearScale(
        startY,
        endY,
        startMap,
        endMap
    );

    valToPx = new LinearScale(
        startMap,
        endMap,
        startY,
        endY
    );

    visibleAmt = newVisible;
    visiblePx = valToPx.scale(visibleAmt) - valToPx.scale(0);
    curVal = 0;
    curPos = newStartY;

    // -- Attach public members --
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.update = update;
    this.draw = draw;
    this.getVal = getVal;
    this.addVal = addVal;
}
