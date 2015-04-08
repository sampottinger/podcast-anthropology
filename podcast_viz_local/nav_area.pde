class NavButtonPlacement {
    int startX;
    int buttonWidth;

    NavButtonPlacement (int newStartX, int newWidth) {
        startX = newStartX;
        buttonWidth = newWidth;
    }

    int getStartX () {
        return startX;
    }

    int getWidth () {
        return buttonWidth;
    }
};


void drawNavLabel (NavSection section, boolean selected) {
    String targetText = NAV_QUESTIONS.get(section);
    int x = NAV_PLACEMENT.get(section).getStartX();

    String [] lines = split(targetText, "\n");

    fill(selected ? NEAR_BLACK : MID_GREY);
    if (lines.length == 1) {
        text(targetText, x, 30);
    } else {
        text(lines[0], x, 16);
        text(lines[1], x, 30);
    }

    if (selected) {
        rectMode(CORNER);
        rect(x, 34, NAV_PLACEMENT.get(section).getWidth(), 5);
    }
}


void drawNavArea () {
    pushMatrix();
    pushStyle();

    fill(WHITE);
    noStroke();
    rect(0, 0, WIDTH, START_Y_MAIN - 1);

    textFont(FONT_14);

    drawNavLabel(
        NavSection.INTRO,
        selectedSection == NavSection.INTRO
    );
    drawNavLabel(
        NavSection.SHOW_TIMELINE,
        selectedSection == NavSection.SHOW_TIMELINE
    );
    drawNavLabel(
        NavSection.SHOW_OVERVIEW,
        selectedSection == NavSection.SHOW_OVERVIEW
    );
    drawNavLabel(
        NavSection.TOPIC_TIMELINE,
        selectedSection == NavSection.TOPIC_TIMELINE
    );
    drawNavLabel(
        NavSection.TOPIC_EXPLORER,
        selectedSection == NavSection.TOPIC_EXPLORER
    );

    popMatrix();
    popStyle();
}
