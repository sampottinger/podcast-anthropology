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
    private boolean isActive;

    GraphicalTopic (CachedTopic newTopic, LinearScale newBarScale,
        PVector newPos) {

        topic = newTopic;
        barScale = newBarScale;
        pos = newPos;
        cachedBarWidth = barScale.scale(topic.getCount());
        isHovering = false;
        isActive = false;
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
        update();
        isActive = isHovering;

        if (isActive) {
            selectedTopic = topic.getTopic();
            topicsDisplayDirty = true;
            selectTopic(topic.getTopic());
        }
    }

    void onRelease () {

    }

    void draw () {
        pushMatrix();
        pushStyle();

        translate(pos.x, pos.y);

        fill(isHovering || isActive ? DARK_GREY : MID_GREY);
        noStroke();

        textFont(FONT_10);
        textAlign(RIGHT);
        text(topic.getTopic(), 0, 10);

        rectMode(CORNER);
        fill(isHovering || isActive ? MID_GREY : LIGHT_GREY);
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
    float cacheHeight;
    ArrayList<OverlapArc> arcs;

    CachedArcs(float newX, float newY, float newHeight,
        ArrayList<OverlapArc> newArcs) {

        x = newX;
        y = newY;
        graphicsCache = null;
        cacheHeight = newHeight;
        arcs = newArcs;
    }

    private void updateCache () {
        graphicsCache = createGraphics(WIDTH, int(cacheHeight) + 50);
        graphicsCache.beginDraw();
        for (OverlapArc newArc : arcs) {
            newArc.drawBg(graphicsCache);
        }
        for (OverlapArc newArc : arcs) {
            newArc.drawFg(graphicsCache);
        }
        graphicsCache.endDraw();

        topicsDisplayDirty = false;
    }

    void draw () {
        if (topicsDisplayDirty || graphicsCache == null) { updateCache(); }

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
    String topic1;
    String topic2;

    OverlapArc (float newStartY, float newEndY, float newOverlapSize,
        LinearScale newOverlapScale, String newTopic1, String newTopic2) {

        startY = newStartY;
        endY = newEndY;
        overlapSize = newOverlapSize;
        overlapScale = newOverlapScale;
        topic1 = newTopic1;
        topic2 = newTopic2;
    }

    boolean isSelected () {
        boolean isSelected;
        if (selectedTopic == null) {
            isSelected = false;
        } else {
            isSelected = selectedTopic.equals(topic1);
            isSelected = isSelected || selectedTopic.equals(topic2);
        }

        return isSelected;
    }

    void drawFg (PGraphics targetContext) {
        if (isSelected()) {
            drawArc(targetContext, NEAR_BLACK);
        }
    }

    void drawArc (PGraphics targetContext, int targetColor) {
        targetContext.pushMatrix();
        targetContext.pushStyle();

        targetContext.noFill();
        targetContext.ellipseMode(CENTER);

        targetContext.stroke(targetColor);

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

    void drawBg (PGraphics targetContext) {
        if (!isSelected()) {
            drawArc(targetContext, MID_GREY_TRANSPARENT);
        }
    }
};
