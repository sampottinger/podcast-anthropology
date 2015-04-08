interface ButtonListener {
    void onPress();
}


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
    private int startX;
    private int startY;
    private int rectWidth;
    private int rectHeight;
    private int rectColor;

    StaticRect(int newStartX, int newStartY, int newWidth, int newHeight,
        int newColor) {

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
