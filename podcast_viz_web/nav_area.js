function NavButtonPlacement (newStartX, newWidth) {
    // Private vars
    var startX;
    var buttonWidth;

    // Method declarations
    var getStartX = function () {
        return startX;
    };

    var getWidth = function () {
        return buttonWidth;
    };

    // Init
    startX = newStartX;
    buttonWidth = newWidth;

    // Attach public members
    this.getStartX = getStartX;
    this.getWidth = getWidth;
}


var createNavButton = function (section, selected, listener) {
    var startX = NAV_PLACEMENT.get(section).getStartX();
    var targetText = NAV_QUESTIONS.get(section);
    var newWidth = NAV_PLACEMENT.get(section).getWidth();

    var retButton = new NavButton (
        startX,
        0,
        newWidth,
        targetText,
        listener
    );
    retButton.setSelected(selected);
    
    return retButton;
};


var createNavArea = function () {
    navBarEntities = [];

    navBarEntities.push(new StaticRect(
        0,
        0,
        WIDTH,
        START_Y_MAIN - 1,
        WHITE
    ));

    navBarEntities.push(new NavFlasher(5, 25));

    navBarEntities.push(createNavButton(
        NavSection.INTRO,
        selectedSection == NavSection.INTRO,
        {
            onPress: function () {
                selectedSection = NavSection.INTRO;
                runIntroFinalPage();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.SHOW_TIMELINE,
        selectedSection == NavSection.SHOW_TIMELINE,
        {
            onPress: function () {
                selectedSection = NavSection.SHOW_TIMELINE;
                enterEpisodeTimeline();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.SHOW_OVERVIEW,
        selectedSection == NavSection.SHOW_OVERVIEW,
        {
            onPress: function () {
                selectedSection = NavSection.SHOW_OVERVIEW;
                enterEpisodeDurationView();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.TOPIC_EXPLORER,
        selectedSection == NavSection.TOPIC_EXPLORER,
        {
            onPress: function () {
                selectedSection = NavSection.TOPIC_EXPLORER;
                enterTopicMovement();
            }
        }
    ));
};
