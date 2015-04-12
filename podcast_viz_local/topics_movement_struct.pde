class CachedTopic implements Comparable<CachedTopic> {
    String topic;
    int count;

    CachedTopic (String newTopic, int newCount) {
        topic = newTopic;
        count = newCount;
    }

    String getTopic () {
        return topic;
    }

    int getCount () {
        return count;
    }

    int compareTo (CachedTopic other) {
        return count - other.getCount();
    }
};


class GraphicalTopic implements GraphicEntity {
    private CachedTopic topic;
    private LinearScale barScale;
    private PVector pos;
    private float cachedBarWidth;
    private boolean isHovering;

    GraphicalTopic (CachedTopic newTopic, LinearScale newBarScale,
        PVector newPos) {

        topic = newTopic;
        barScale = newBarScale;
        pos = newPos;
        cachedBarWidth = barScale.scale(topic.getCount());
        isHovering = false;
    }

    void update () {
        isHovering = adjustedMouseX > pos.x - 70;
        isHovering = isHovering && adjustedMouseX < pos.x + 100;
        isHovering = isHovering && adjustedMouseY > pos.y;
        isHovering = isHovering && adjustedMouseY < pos.y + 11;

        preventDefaultCursor = true;
        cursor(HAND);
    }

    void onPress () {

    }

    void onRelease () {

    }

    void draw () {
        pushMatrix();
        pushStyle();

        translate(pos.x, pos.y);

        fill(isHovering ? DARK_GREY : MID_GREY);
        noStroke();

        textFont(FONT_10);
        textAlign(RIGHT);
        text(topic.getTopic(), 0, 10);

        rectMode(CORNER);
        fill(isHovering ? MID_GREY : LIGHT_GREY);
        rect(2, 6, 98, 1);

        rect(2, 4, cachedBarWidth, 5);

        popMatrix();
        popStyle();
    }
};


class CachedArcs implements GraphicEntity {
    float x;
    float y;
    PGraphics graphicsCache;

    CachedArcs(float newX, float newY, float newHeight,
        ArrayList<OverlapArc> arcs) {

        x = newX;
        y = newY;

        graphicsCache = createGraphics(WIDTH, int(newHeight) + 50);
        graphicsCache.beginDraw();
        for (OverlapArc newArc : arcs) {
            newArc.draw(graphicsCache);
        }
        graphicsCache.endDraw();
    }

    void draw () {
        image(graphicsCache, x, y);
    }

    void update () {}
    void onPress () {}
    void onRelease () {}
};


class OverlapArc {
    float startY;
    float endY;
    float overlapSize;
    LinearScale overlapScale;

    OverlapArc (float newStartY, float newEndY, float newOverlapSize,
        LinearScale newOverlapScale) {

        startY = newStartY;
        endY = newEndY;
        overlapSize = newOverlapSize;
        overlapScale = newOverlapScale;
    }

    void draw (PGraphics targetContext) {
        targetContext.pushMatrix();
        targetContext.pushStyle();

        targetContext.noFill();
        targetContext.ellipseMode(CENTER);

        targetContext.stroke(NEAR_BLACK_EXTRA_TRANSPARENT);
        targetContext.strokeWeight(overlapScale.scale(overlapSize));

        targetContext.arc(
            WIDTH - 250,
            (startY + endY) / 2.0,
            20 + (endY - startY) / 5.2,
            endY - startY,
            -PI / 2,
            PI / 2
        );

        targetContext.popMatrix();
        targetContext.popStyle();
    }
};
