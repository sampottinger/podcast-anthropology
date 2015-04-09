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


NavButton createNavButton (NavSection section, boolean selected,
    ButtonListener listener) {

    int startX = NAV_PLACEMENT.get(section).getStartX();
    String targetText = NAV_QUESTIONS.get(section);
    int newWidth = NAV_PLACEMENT.get(section).getWidth();

    NavButton retButton = new NavButton (
        startX,
        0,
        newWidth,
        targetText,
        listener
    );
    retButton.setSelected(selected);
    
    return retButton;
}


void createNavArea () {
    navBarEntities = new ArrayList<GraphicEntity>();

    navBarEntities.add(new StaticRect(
        0,
        0,
        WIDTH,
        START_Y_MAIN - 1,
        WHITE
    ));

    navBarEntities.add(createNavButton(
        NavSection.INTRO,
        selectedSection == NavSection.INTRO,
        null
    ));
    navBarEntities.add(createNavButton(
        NavSection.SHOW_TIMELINE,
        selectedSection == NavSection.SHOW_TIMELINE,
        new ButtonListener () {
            public void onPress () {
                selectedSection = NavSection.SHOW_TIMELINE;
                enterEpisodeTimeline();
            }
        }
    ));
    navBarEntities.add(createNavButton(
        NavSection.SHOW_OVERVIEW,
        selectedSection == NavSection.SHOW_OVERVIEW,
        null
    ));
    navBarEntities.add(createNavButton(
        NavSection.TOPIC_EXPLORER,
        selectedSection == NavSection.TOPIC_EXPLORER,
        null
    ));
}
