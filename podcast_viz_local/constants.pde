final float ACCELERATION = 700;

public enum AggregationLevel {
    WEEK,
    MONTH,
    YEAR
};

final int BACKGROUND_COLOR = unhex("FFEEEEEE");

final int BLACK = unhex("FF000000");

final int DARK_GREY = unhex("FF555555");

final String DATASET_JSON_LOC = "combined.json";

final PVector DEFAULT_POSITION = new PVector(-100, 300);

final int DETAILS_AREA_HEIGHT = 47;

final int EPISODE_HOVER_DISTANCE = 12;

final int EPISODE_DIAMETER = EPISODE_HOVER_DISTANCE * 2;

HashMap<String, ColorSet> SHOW_COLORS = new HashMap<String, ColorSet>();

PFont FONT_10;

PFont FONT_12;

PFont FONT_14;

final LinearScale HALO_SCALE = new LinearScale(0, 3600, 0, 300);

final int HEIGHT = 650;

final int INTER_SUMMARY_GRP_PAD = 70;

final int INTRO_ROW_SIZE = 43;

final int INTRO_TEXT_STEP = 20;

final int INTRO_TEXT_STEPS = 30;

final int INTRO_TEXT_X = 350;

final int INTRO_TEXT_Y = 70;

final int EXTRA_LIGHT_GREY = unhex("FFD0D0D0");

final int LIGHT_GREY = unhex("FFC0C0C0");

final float MAX_SPEED = 1000;

final int MID_GREY = unhex("FF777777");

final int NEAR_BLACK = unhex("FF333333");

final String[] ORDERED_SHOW_NAMES = {
    "This American Life",
    "Radiolab",
    "99% Invisible",
    "The Memory Palace",
    "Hello Internet"
};

public enum NavSection {
    INTRO,
    SHOW_TIMELINE,
    SHOW_OVERVIEW,
    TOPIC_TIMELINE,
    TOPIC_EXPLORER
};

HashMap<NavSection, String> NAV_QUESTIONS = new HashMap<NavSection, String>();

HashMap<NavSection, NavButtonPlacement> NAV_PLACEMENT;

final int SCROLL_WIDTH = 10;

final DateTime START_DATE = new DateTime(1995, 1, 1, 0, 0);

final int START_Y_MAIN = 40;

final int WHITE = unhex("FFFFFFFF");

final int WIDTH = 950;

JSONObject TEXT_CONSTANTS;

final int TIMELINE_GROUP_HEIGHT = EPISODE_DIAMETER * 5 + 40;

final int TIMELINE_GROUP_START_X = 150;

final int TIMELINE_GROUP_START_Y = 140;

void loadSemiConstants () {

    TEXT_CONSTANTS = loadJSONObject("text.json");

    // Load fonts
    FONT_10 = loadFont("LeagueSpartan-Bold-10.vlw");
    FONT_12 = loadFont("LeagueSpartan-Bold-12.vlw");
    FONT_14 = loadFont("LeagueSpartan-Bold-14.vlw");

    // Specify text of nav sections
    NAV_QUESTIONS.put(
        NavSection.INTRO,
        "Intro"
    );
    NAV_QUESTIONS.put(
        NavSection.SHOW_TIMELINE,
        "When and how often\nwere shows released?"
    );
    NAV_QUESTIONS.put(
        NavSection.SHOW_OVERVIEW,
        "How has show length\nvaried?"
    );
    NAV_QUESTIONS.put(
        NavSection.TOPIC_TIMELINE,
        "When did podcasts\ndiscuss what?"
    );
    NAV_QUESTIONS.put(
        NavSection.TOPIC_EXPLORER,
        "What did podcasts dicuss and\nhow are topics related?"
    );

    // Create section placements
    NAV_PLACEMENT = new HashMap<NavSection, NavButtonPlacement>();
    NAV_PLACEMENT.put(
        NavSection.INTRO,
        new NavButtonPlacement(20, 40)
    );
    NAV_PLACEMENT.put(
        NavSection.SHOW_TIMELINE,
        new NavButtonPlacement(120, 200)
    );
    NAV_PLACEMENT.put(
        NavSection.SHOW_OVERVIEW,
        new NavButtonPlacement(340, 220)
    );
    NAV_PLACEMENT.put(
        NavSection.TOPIC_EXPLORER,
        new NavButtonPlacement(560, 240)
    );
}
