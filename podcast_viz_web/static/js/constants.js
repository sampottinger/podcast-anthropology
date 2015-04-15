var ACCELERATION = 500;

var AggregationLevel = {
    WEEK: "1",
    MONTH: "2",
    YEAR: "3"
};

var BACKGROUND_COLOR = "#EEEEEE";

var BLACK = "#000000";

var DARK_GREY = "#555555";

var DATASET_JSON_LOC = "combined.json";

var DEFAULT_POSITION = new p5.Vector(-100, 300);

var DETAILS_AREA_HEIGHT = 47;

var EPISODE_HOVER_DISTANCE = 10;

var EPISODE_DIAMETER = EPISODE_HOVER_DISTANCE * 2 + 2;

var SHOW_COLORS = dict();

var FONT_10;

var FONT_12;

var FONT_14;

var HALO_SCALE = new LinearScale(0, 3600, 0, 300);

var HEIGHT = 630;

var INTER_SUMMARY_GRP_PAD = 77;

var INTRO_ROW_SIZE = 43;

var INTRO_TEXT_STEP = 20;

var INTRO_TEXT_STEPS = 30;

var INTRO_TEXT_X = 350;

var INTRO_TEXT_Y = 70;

var EXTRA_LIGHT_GREY = "#D0D0D0";

var LIGHT_GREY = "#C0C0C0";

var MAX_SPEED = 1000;

var MIN_SPEED = 10;

var MID_GREY = "#777777";

var NEAR_BLACK = "#333333";

var NEAR_BLACK_TRANSPARENT = "#333333";

var MID_GREY_TRANSPARENT;

var ORDERED_SHOW_NAMES = [
    "This American Life",
    "Radiolab",
    "99% Invisible",
    "The Memory Palace",
    "Hello Internet"
];

var NavSection = {
    INTRO: "1",
    SHOW_TIMELINE: "2",
    SHOW_OVERVIEW: "3",
    TOPIC_TIMELINE: "4",
    TOPIC_EXPLORER: "5"
};

var NAV_QUESTIONS = dict();

var NAV_PLACEMENT = dict();

var SCROLL_WIDTH = 10;

var START_DATE = moment({year: 1995, month: 1, day: 1});

var START_Y_MAIN = 42;

var WHITE = "#FFFFFF";

var WIDTH = 950;

var TEXT_CONSTANTS;

var TIMELINE_GROUP_HEIGHT = EPISODE_DIAMETER * 5 + 40;

var DURATION_GROUP_HEIGHT = EPISODE_DIAMETER * 21 + 40;

var TIMELINE_GROUP_START_X = 150;

var TIMELINE_GROUP_START_Y = 140;

var TEXT_SOURCE_LOC = "text.json";

var loadSemiConstants = function () {

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
