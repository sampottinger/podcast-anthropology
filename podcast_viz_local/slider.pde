class Slider implements GraphicEntity{
    private LinearScale pxToVal;
    private LinearScale valToPx;
    private float startX;
    private float endX;
    private float startY;
    private float endY;
    private float curVal;
    private float curPos;
    private float visibleAmt;
    private float visiblePx;
    private boolean active;
    private boolean hovering;

    Slider (float newStartX, float newEndX, float newStartY, float newEndY,
        float startMap, float endMap, float newVisible) {

        startX = newStartX;
        endX = newEndX;
        startY = newStartY;
        endY = newEndY;
        active = false;

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
    }

    void updateHovering () {
        hovering = mouseX > startX;
        hovering = hovering && mouseX < endX;
        hovering = hovering && mouseY > startY;
        hovering = hovering && mouseY < endY;
    }

    void onPress () {
        updateHovering();
        if (hovering) {
            active = true;
        }
    }

    void onRelease () {
        active = false;
    }

    void update () {
        updateHovering();
        if (!active) {
            return;
        }

        curPos = mouseY - startY;
        if (curPos > endY - visiblePx) {
            curPos = endY - visiblePx;
        }
        if (curPos < startY) {
            curPos = startY;
        }

        curVal = pxToVal.scale(curPos);
    }

    void draw () {
        pushMatrix();
        pushStyle();

        rectMode(CORNERS);
        noStroke();

        fill(WHITE);
        rect(startX, startY, endX, endY);

        fill(hovering || active ? MID_GREY : LIGHT_GREY);
        rect(startX, curPos, endX, curPos + visiblePx);

        popMatrix();
        popStyle();
    }

    float getVal() {
        return curVal;
    }
};
