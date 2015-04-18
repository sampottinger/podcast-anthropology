/**
 * Logic and structures to run the navigation bar at the top of the tool.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Structure describing the placement and dimensions of a nav bar button.
 *
 * @constructor
 * @param {Number} newStartX - The x coordinate in pixels of where the left
 *      side of the nav bar should be.
 * @param {Number} newWidth - The width of the nav bar button in pixels.
 */
function NavButtonPlacement(newStartX, newWidth) {
    // -- Private vars --
    var startX;
    var buttonWidth;

    // -- Method declarations --

    /**
     * Get the x coordinate in pixels where the button should start.
     *
     * @return {Number} The x coordinate where the left side of the button
     *      should be.
     */
    var getStartX = function() {
        return startX;
    };

    /**
     * Get the width of the button in pixels.
     *
     * @return {Number} The width of the button in pixels.
     */
    var getWidth = function() {
        return buttonWidth;
    };

    // -- Constructor --
    startX = newStartX;
    buttonWidth = newWidth;

    // -- Attach public members --
    this.getStartX = getStartX;
    this.getWidth = getWidth;
}


/**
 * Listener for when a navigation button is selected.
 *
 * @typedef {Object} NavButtonListener
 * @property {function} listener - Function without any parameters or return
 *      value that will be called when the button is selected
 */


/**
 * Create a new navigation button.
 *
 * @param {String} section - The name of the selection.
 * @param {boolean} selected - Flag indicating if the nav button should be
 *      marked as having been selected by the user or not.
 * @param {NavButtonListener} listener - Listener to call when the button
 *      is selected
 * @return {NavButton} Newly created nav button for the provided section
 *      with the provided listener.
 */
var createNavButton = function(section, selected, listener) {
    var startX = NAV_PLACEMENT.get(section).getStartX();
    var targetText = NAV_QUESTIONS.get(section);
    var newWidth = NAV_PLACEMENT.get(section).getWidth();

    var retButton = new NavButton (
        startX,
        2,
        newWidth,
        targetText,
        listener
    );
    retButton.setSelected(selected);
    
    return retButton;
};


/**
 * Factory function to create the navigation area at the top of the tool.
 */
var createNavArea = function() {
    navBarEntities = [];

    navBarEntities.push(new StaticRect(
        0,
        0,
        WIDTH,
        START_Y_MAIN - 1,
        WHITE
    ));

    navBarEntities.push(new NavFlasher(5, 27));

    navBarEntities.push(createNavButton(
        NavSection.INTRO,
        selectedSection === NavSection.INTRO,
        {
            onPress: function() {
                selectedSection = NavSection.INTRO;
                runIntroFinalPage();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.SHOW_TIMELINE,
        selectedSection === NavSection.SHOW_TIMELINE,
        {
            onPress: function() {
                selectedSection = NavSection.SHOW_TIMELINE;
                enterEpisodeTimeline();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.SHOW_OVERVIEW,
        selectedSection === NavSection.SHOW_OVERVIEW,
        {
            onPress: function() {
                selectedSection = NavSection.SHOW_OVERVIEW;
                enterEpisodeDurationView();
            }
        }
    ));
    navBarEntities.push(createNavButton(
        NavSection.TOPIC_EXPLORER,
        selectedSection === NavSection.TOPIC_EXPLORER,
        {
            onPress: function() {
                selectedSection = NavSection.TOPIC_EXPLORER;
                enterTopicMovement();
            }
        }
    ));
};
