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

    void updateHovering (int localMouseX, int localMouseY) {
        hovering = localMouseX > startX;
        hovering = hovering && localMouseX < endX;
        hovering = hovering && localMouseY > startY;
        hovering = hovering && localMouseY < endY;
    }

    void onPress (int localMouseX, int localMouseY) {
        updateHovering(localMouseX, localMouseY);
        if (hovering) {
            active = true;
        }
    }

    void onRelease (int localMouseX, int localMouseY) {
        active = false;
    }

    void update (int localMouseX, int localMouseY) {
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
