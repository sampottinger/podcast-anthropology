function Slider (newStartX, newEndX, newStartY, newEndY, startMap, endMap,
    newVisible) {

    // Private vars
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

    // Method declarations
    var updateHovering = function (localMouseX, localMouseY) {
        hovering = localMouseX > startX;
        hovering = hovering && localMouseX < endX;
        hovering = hovering && localMouseY > startY;
        hovering = hovering && localMouseY < endY;
    };

    var onPress = function (localMouseX, localMouseY) {
        updateHovering(localMouseX, localMouseY);
        if (hovering) {
            active = true;
        }
    };

    var onRelease = function (localMouseX, localMouseY) {
        active = false;
    };

    var update = function (localMouseX, localMouseY) {
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

    var draw = function () {
        push();

        rectMode(CORNERS);
        noStroke();

        fill(WHITE);
        rect(startX, startY, endX, endY);

        fill(hovering || active ? MID_GREY : LIGHT_GREY);
        rect(startX, curPos, endX, curPos + visiblePx);

        pop();
    };

    var getVal = function () {
        return curVal;
    };

    var addVal = function (delta) {
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

    // Init
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

    // Attach public members
    this.updateHovering = updateHovering;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.update = update;
    this.draw = draw;
    this.getVal = getVal;
    this.addVal = addVal;
}
