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