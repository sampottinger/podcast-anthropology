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

    void update (int x, int y) { }

    void onPress (int x, int y) { }

    void onRelease (int x, int y) { }
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

    void update (int x, int y) { }

    void onPress (int x, int y) { }

    void onRelease (int x, int y) { }
};


class TinyLegend implements GraphicEntity {
    private float x;
    private float y;
    private String content;
    private int boxColor;

    TinyLegend(float newX, float newY, String newContent, int newColor) {

        x = newX;
        y = newY;
        content = newContent;
        boxColor = newColor;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        fill(boxColor);
        noStroke();

        rectMode(CORNER);
        fill(boxColor);
        rect(x + 2, y, 7, 7);

        fill(MID_GREY);
        textFont(FONT_10);
        textAlign(RIGHT);
        text(content, x - 1, y + 7);

        popMatrix();
        popStyle();
    }

    void update (int x, int y) {}
    void onPress (int x, int y) {}
    void onRelease (int x, int y) {}
};


class SummaryLegendSection {

    private String name;
    private int boxColor;
    private int count;

    SummaryLegendSection (String newName, int newColor, int newCount) {
        name = newName;
        boxColor = newColor;
        count = newCount;
    }

    String getName () {
        return name;
    }

    int getColor () {
        return boxColor;
    }

    int getCount () {
        return count;
    }
};


class SummaryLegend implements GraphicEntity {
    private float x;
    private float y;
    private String content;
    private ArrayList<SummaryLegendSection> sections;
    private LinearScale innerScale;

    SummaryLegend (float newX, float newY, String newContent,
        ArrayList<SummaryLegendSection> newSections, LinearScale newScale) {

        x = newX;
        y = newY;
        content = newContent;
        sections = newSections;
        innerScale = newScale;
    }

    void draw () {
        pushMatrix();
        pushStyle();

        noStroke();

        translate(x, y);

        fill(MID_GREY);
        textFont(FONT_14);
        textAlign(RIGHT);
        text(content, 0, 0);

        int i = 0;
        textFont(FONT_10);
        rectMode(CORNER);
        for (SummaryLegendSection section : sections) {
            int y = i * 18 + 13;

            fill(EXTRA_LIGHT_GREY);
            rect(-6, y - 11, innerScale.scale(section.getCount()), 13);

            fill(section.getColor());
            rect(-4, y-6, 4, 4);

            fill(MID_GREY);
            text(section.getName(), -6, y);

            i++;
        }

        popMatrix();
        popStyle();
    }

    void update (int x, int y) {}
    void onPress (int x, int y) {}
    void onRelease (int x, int y) {}
};
