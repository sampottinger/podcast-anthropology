interface AxisLabelStrategy {
    String getLabel (float inputVal);
};


class RawAxisLabelStrategy implements AxisLabelStrategy {
    String getLabel (float inputVal) {
        return str(int(inputVal));
    }
};


class MonthNumToYearLabelStrategy implements AxisLabelStrategy {
    String getLabel (float inputVal) {
        int intInputVal = int(inputVal);
        return str(intInputVal / 12);
    }
};


class NumberAxis implements GraphicEntity {
    private LinearScale targetScale;
    private float x;
    private float y;
    private float axisWidth;
    private float startVal;
    private float endVal;
    private float interval;
    private AxisLabelStrategy labelStrategy;

    NumberAxis (float newX, float newY, float newWidth, LinearScale newScale,
        float newStart, float newEnd, float newInterval,
        AxisLabelStrategy newLabelStrategy) {

        x = newX;
        y = newY;
        axisWidth = newWidth;
        targetScale = newScale;
        startVal = newStart;
        endVal = newEnd;
        interval = newInterval;
        labelStrategy = newLabelStrategy;
    }

    void drawDottedRule (float y) {
        for (float dotX = 0; dotX < axisWidth; dotX += 4) {
            rect(x + dotX, y, 2, 1);
        }
    }

    void draw () {
        pushStyle();
        pushMatrix();

        rectMode(CORNER);
        noStroke();
        fill(MID_GREY);

        drawDottedRule(y + 14);

        textFont(FONT_10);
        textAlign(CENTER);
        for (float val = startVal; val <= endVal; val += interval) {
            text(
                labelStrategy.getLabel(val),
                targetScale.scale(val),
                y + 11
            );
        }

        popStyle();
        popMatrix();
    }

    void update () { }

    void onPress () { }

    void onRelease () { }
};


class YMarker implements GraphicEntity {
    float x;
    float y;
    String value;
    float markerWidth;

    YMarker (float newX, float newY, float newWidth, String newValue) {
        x = newX;
        y = newY;
        value = newValue;
        markerWidth = newWidth;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        rectMode(CORNER);
        noStroke();
        fill(LIGHT_GREY);
        rect(x, y, markerWidth, 1);

        textFont(FONT_10);
        textAlign(LEFT, CENTER);
        text(value, x + markerWidth + 2, y);

        popStyle();
        popMatrix();
    }

    void update () { }

    void onPress () { }

    void onRelease () { }
};
