interface ButtonListener {
    void onPress();
}


class TinyLegend implements GraphicEntity {
    private int x;
    private int y;
    private String content;
    private int boxColor;

    TinyLegend(int newX, int newY, String newContent, int newColor) {

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

    void update () {}
    void onPress () {}
    void onRelease () {}
};


class Button implements GraphicEntity {
    private int startX;
    private int startY;
    private int buttonWidth;
    private int buttonHeight;
    private boolean hovering;
    private String buttonText;
    private ButtonListener listener;

    Button (int newX, int newY, int newWidth, int newHeight, String newText,
        ButtonListener newListener) {

        startX = newX;
        startY = newY;
        buttonWidth = newWidth;
        buttonHeight = newHeight;
        hovering = false;
        buttonText = newText;
        listener = newListener;
    }

    void draw () {
        pushStyle();
        pushMatrix();

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
        textFont(FONT_12);
        text(
            buttonText,
            startX + buttonWidth / 2,
            startY + buttonHeight / 2 + 5
        );

        popStyle();
        popMatrix();
    }

    void update () {
        boolean isOutside = false;
        isOutside = isOutside || (adjustedMouseX < startX);
        isOutside = isOutside || (adjustedMouseX > startX + buttonWidth);
        isOutside = isOutside || (adjustedMouseY < startY);
        isOutside = isOutside || (adjustedMouseY > startY + buttonHeight);
        hovering = !isOutside;
    }

    void onPress () {
        update();
        if (hovering && listener != null) {
            listener.onPress();
        }
    }

    void onRelease () {}
};


class NavButton implements GraphicEntity {
    private boolean hovering;
    private boolean selected;
    private int startX;
    private int startY;
    private int buttonWidth;
    private String[] lines;
    private ButtonListener listener;

    NavButton (int newStartX, int newStartY, int newWidth, String newText,
        ButtonListener newListener) {

        startX = newStartX;
        startY = newStartY;
        buttonWidth = newWidth;
        lines = split(newText, "\n");
        listener = newListener;
    }

    void setSelected (boolean newState) {
        selected = newState;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        if (hovering) {
            preventDefaultCursor = true;
            cursor(HAND);
        }

        textFont(FONT_14);
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

        popStyle();
        popMatrix();
    }

    void update () {
        hovering = mouseY < START_Y_MAIN;
        hovering = hovering && mouseY > startY;
        hovering = hovering && mouseX > startX;
        hovering = hovering && mouseX < (startX + buttonWidth);
    }

    void onPress () {
        update();
        if (hovering && listener != null) {
            listener.onPress();
        }
    }

    void onRelease () {}
};


class StaticRect implements GraphicEntity {
    private float startX;
    private float startY;
    private float rectWidth;
    private float rectHeight;
    private int rectColor;

    StaticRect(float newStartX, float newStartY, float newWidth,
        float newHeight, int newColor) {

        startX = newStartX;
        startY = newStartY;
        rectWidth = newWidth;
        rectHeight = newHeight;
        rectColor = newColor;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        rectMode(CORNER);
        noStroke();
        fill(rectColor);
        rect(startX, startY, rectWidth, rectHeight);

        popStyle();
        popMatrix();
    }

    void update () { }

    void onPress () { }

    void onRelease () { }
};


class Title implements GraphicEntity {
    private float x;
    private float y;
    private float titleWidth;
    private String content;

    Title (float newX, float newY, float newWidth, String newContent) {
        x = newX;
        y = newY;
        titleWidth = newWidth;
        content = newContent;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        rectMode(CORNER);
        noStroke();
        fill(MID_GREY);

        rect(x, y + 15, titleWidth, 1);

        textFont(FONT_14);
        textAlign(LEFT);
        text(content, x, y + 14);

        popStyle();
        popMatrix();
    }

    void update () { }

    void onPress () { }

    void onRelease () { }
};


class NumberAxis implements GraphicEntity {
    private LinearScale targetScale;
    private float x;
    private float y;
    private float axisWidth;
    private float startVal;
    private float endVal;
    private float interval;

    NumberAxis (float newX, float newY, float newWidth, LinearScale newScale,
        float newStart, float newEnd, float newInterval) {

        x = newX;
        y = newY;
        axisWidth = newWidth;
        targetScale = newScale;
        startVal = newStart;
        endVal = newEnd;
        interval = newInterval;
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
        textAlign(LEFT);
        for (float val = startVal; val <= endVal; val += interval) {
            text(round(val), targetScale.scale(val), y + 11);
        }

        popStyle();
        popMatrix();
    }

    void update () { }

    void onPress () { }

    void onRelease () { }
};
