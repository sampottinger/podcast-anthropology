/**
 * Constants for colors, layouts, fonts, and data processing.
 *
 * @author Sam Pottinger
 * @license MIT License
 */

/**
 * How fast particles accelerate in pixels / cycle^2.
 *
 * @const
 */
var ACCELERATION = 500;

/**
 * Enum describing the levels of grouping available for a date.
 *
 * @const
 */
var AggregationLevel = {
    WEEK: "1",
    MONTH: "2",
    YEAR: "3"
};

/**
 * Background color for visualization canvas.
 *
 * @const
 */
var BACKGROUND_COLOR = "#EEEEEE";

/**
 * Color to use for "black" geometries and text.
 *
 * @const
 */
var BLACK = "#000000";

/**
 * Color to use for "dark grey" geometries and text.
 * 
 * @const
 */
var DARK_GREY = "#555555";

/**
 * Location of the JSON file with the visualization data.
 *
 * @const
 */
var DATASET_JSON_LOC = "combined.json";

/**
 * Position where the particles start from by default.
 *
 * @const
 */
var DEFAULT_POSITION = new p5.Vector(-100, 300);

/**
 * The height of the "details" bar in pixels.
 *
 * @const
 */
var DETAILS_AREA_HEIGHT = 47;

/**
 * How tall in pixels each group should be in the duration graph.
 *
 * The height in pixels that should be allocated to each podcast within the
 * duration graph, a histogram showing how long each podcast show was in
 * minutes. Calculated later as a semi-constant.
 *
 * @const
 */
var DURATION_GROUP_HEIGHT;

/**
 * Hover area radius from the center of an episode particle (pixels).
 *
 * @const
 */
var EPISODE_HOVER_DISTANCE = 10;

/**
 * The maximum diameter of an episode particle (pixels).
 *
 * @const
 */
var EPISODE_DIAMETER;

/**
 * Color to use for "extra light grey" fill and text color.
 *
 * @const
 */
var EXTRA_LIGHT_GREY = "#D0D0D0";

/**
 * Small "detail" font, loaded as a "semi-constant".
 *
 * @const
 */
var FONT_10;

/**
 * Medium "body" font, loaded as a "semi-constant".
 *
 * @const
 */
var FONT_12;

/**
 * Large "seciton header" font, loaded as a "semi-constant".
 *
 * @const
 */
var FONT_14;

/**
 * Scale for the halo, mapping duration in seconds to area (pixels squared).
 *
 * @const
 */
var HALO_SCALE = new LinearScale(0, 3600, 0, 300);

/**
 * The height of the canvas in pixels.
 *
 * @const
 */
var HEIGHT = 630;

/**
 * Padding between groups within intro movement.
 *
 * Padding between groups that runs on the "intro" tab, indicating how many
 * pixels should separate the episode particles for each show.
 *
 * @const
 */
var INTER_SUMMARY_GRP_PAD = 77;

/**
 * The number of particles per row within the intro movement.
 *
 * @const
 */
var INTRO_ROW_SIZE = 43;

/**
 * The distance (in pixels) between lines in the intro text.
 *
 * @const
 */
var INTRO_TEXT_STEP = 20;

/**
 * The starting X coordinate of the text within the intro movement (in pixels).
 *
 * @const
 */
var INTRO_TEXT_X = 350;

/**
 * The starting Y coordinate of the text within the intro movement (in pixels).
 *
 * @const
 */
var INTRO_TEXT_Y = 70;

/**
 * Color to use for "light grey" fill and text color.
 *
 * @const
 */
var LIGHT_GREY = "#C0C0C0";

/**
 * The maximum speed of a particle in pixels per cycle.
 *
 * @const
 */
var MAX_SPEED = 1000;

/**
 * The minimum speed of a particle in pixels per cycle.
 *
 * @const
 */
var MIN_SPEED = 10;

/**
 * Fill color to use for "mid grey" text and graphics.
 *
 * @const
 */
var MID_GREY = "#777777";

/**
 * Fill color to use for "near black" text and graphics.
 *
 * @const
 */
var NEAR_BLACK = "#333333";

/**
 * Fill color to use for semi-transparent "near back" text and graphics.
 *
 * @const
 */
var NEAR_BLACK_TRANSPARENT = "#333333";

/**
 * Color to use for "mid grey" text and graphics, loaded as semi-constant.
 *
 * @const
 */
var MID_GREY_TRANSPARENT;

/**
 * Enum describing the different sections ("movements") of the visualization.
 *
 * @const
 */
var NavSection = {
    INTRO: "1",
    SHOW_TIMELINE: "2",
    SHOW_OVERVIEW: "3",
    TOPIC_TIMELINE: "4",
    TOPIC_EXPLORER: "5"
};

/**
 * The human-readable questions for each section ("movement").
 *
 * Dict mapping the ID for a navigation section ("movement") to the human
 * question that the movement answers. Semi-constant loaded from data files
 * elsewhere in code.
 *
 * @const
 */
var NAV_QUESTIONS = dict();

/**
 * Location for where the nav sections should be placed.
 *
 * Mapping from the ID for a navigation section ("movement") to the location
 * of the button for that movement. Semi-constant.
 *
 * @const
 */
var NAV_PLACEMENT = dict();

/**
 * The podcasts to be visualized in the order they should be listed to the user.
 *
 * @const
 */
var ORDERED_SHOW_NAMES = [
    "This American Life",
    "Radiolab",
    "99% Invisible",
    "The Memory Palace",
    "Hello Internet"
];

/**
 * Width of the scrollbar in pixels.
 *
 * @const
 */
var SCROLL_WIDTH = 10;

/**
 * Colors for each show, mapping string name to color.
 *
 * Semi-constant loaded from data files elsewhere in code that describe the
 * colors that should be used for each podcast visualized.
 *
 * @const
 */
var SHOW_COLORS = dict();

/**
 * The date of the earliest visualization episode that should be visualized.
 *
 * @const
 */
var START_DATE = moment({year: 1995, month: 1, day: 1});

/**
 * The y coordinate where the "main stage" should start.
 *
 * The y coordinate in pixels where the body of the visualzation should start,
 * appearing right below the navigation bar.
 *
 * @const
 */
var START_Y_MAIN = 42;

/**
 * Dict mapping name of text to the text body.
 *
 * Collection of long strings of human-readable text within a dict where the
 * name of the long string is mapped to the string itself which may contain
 * newlines ("\n"). Semi-constant loaded from data files elsewhere in code.
 *
 * @const
 */
var TEXT_CONSTANTS;

/**
 * The location of the file containing long text constants.
 *
 * Location of the file that contains the values that will be loaded into
 * TEXT_CONSTANTS, a dict mapping the name of a long string to the long
 * string itself.
 *
 * @const
 */
var TEXT_SOURCE_LOC = "text.json";

/**
 * The height of each group within the timeline histogram.
 *
 * The height in pixels to allocate for each podcast within the timeline chart,
 * a histogram showing how many shows were released per podcast over time.
 * Semi-constant.
 *
 * @const
 */
var TIMELINE_GROUP_HEIGHT;

/**
 * The x coordinate (in pixels) at which a group within the timeline starts.
 *
 * @const
 */
var TIMELINE_GROUP_START_X = 150;

/**
 * 
 */
var TIMELINE_GROUP_START_Y = 140;

/**
 * Color to use for "white" elements and text.
 *
 * @const
 */
var WHITE = "#FFFFFF";

/**
 * The width of the visualization canvas in pixels.
 *
 * @const
 */
var WIDTH = 950;

/**
 * Load semi-constants.
 *
 * Load constants that are non-trivial to initalize or require calculations
 * based on the values of other constants.
 */
var loadSemiConstants = function() {

    EPISODE_DIAMETER =  = EPISODE_HOVER_DISTANCE * 2 + 2;
    TIMELINE_GROUP_HEIGHT = EPISODE_DIAMETER * 5 + 40;
    DURATION_GROUP_HEIGHT = EPISODE_DIAMETER * 21 + 40;

    TEXT_CONSTANTS = loadJSONObject(TEXT_SOURCE_LOC);

    // Specify text of nav sections
    NAV_QUESTIONS.set(
        NavSection.INTRO,
        "Intro"
    );
    NAV_QUESTIONS.set(
        NavSection.SHOW_TIMELINE,
        "When and how often\nwere shows released?"
    );
    NAV_QUESTIONS.set(
        NavSection.SHOW_OVERVIEW,
        "How has show length\nvaried?"
    );
    NAV_QUESTIONS.set(
        NavSection.TOPIC_TIMELINE,
        "When did podcasts\ndiscuss what?"
    );
    NAV_QUESTIONS.set(
        NavSection.TOPIC_EXPLORER,
        "What did podcasts discuss and\nhow are topics related?"
    );

    // Create section placements
    NAV_PLACEMENT.set(
        NavSection.INTRO,
        new NavButtonPlacement(130, 40)
    );
    NAV_PLACEMENT.set(
        NavSection.SHOW_TIMELINE,
        new NavButtonPlacement(230, 200)
    );
    NAV_PLACEMENT.set(
        NavSection.SHOW_OVERVIEW,
        new NavButtonPlacement(450, 170)
    );
    NAV_PLACEMENT.set(
        NavSection.TOPIC_EXPLORER,
        new NavButtonPlacement(670, 240)
    );

    MID_GREY_TRANSPARENT = color(199, 199, 199, 85);
};
