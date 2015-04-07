HashMap<String, ArrayList<EpisodeGraphic>> graphicEpisodes;


class ShowBubble implements GraphicEntity {
    private PVector pos;
    private Show show;
    private PImage bubbleImage;

    ShowBubble (PVector newPos, Show newShow) {
        pos = newPos;
        show = newShow;
        bubbleImage = loadImage(
            newShow.getName().replace(" ", "").replace("%", "") + ".png"
        );
    }

    void update () { }

    void onPress () { }

    void onRelease () { }

    void draw () {
        pushStyle();
        pushMatrix();

        imageMode(CENTER);
        image(bubbleImage, pos.x, pos.y);

        textFont(FONT_10);
        fill(MID_GREY);

        text(str(show.getEpisodes()) + " eps.", pos.x - 20, pos.y + 35);
        text(getDurText(show.getDur() / show.getEpisodes()) + " avg", pos.x - 20, pos.y + 47);

        popStyle();
        popMatrix();
    }
};


class EpisodeGraphic implements GraphicEntity{
    private PVector pos;
    private PVector targetPos;
    private IdlingStrategy idlingStrategy;
    private Episode episode;
    private float haloRadius;
    private boolean idling;
    private float speed;
    private boolean startedMovingToPos;
    private int lastMillis;
    private boolean hovering;

    EpisodeGraphic (PVector newPos, Episode newEpisode) {
        setPos(newPos);
        idlingStrategy = null;
        episode = newEpisode;
        haloRadius = sqrt(HALO_SCALE.scale(episode.getDur()) / PI);
        idling = true;
        speed = 0;
    }

    void setIdlingStrategy (IdlingStrategy newIdlingStrategy) {
        idlingStrategy = newIdlingStrategy;
    }

    void setPos (PVector newPos) {
        pos = new PVector(newPos.x, newPos.y);
    }

    PVector getPos () {
        return new PVector(pos.x, pos.y);
    }

    void update () {
        if (idlingStrategy != null && idling) {
            idlingStrategy.update(this);
        }

        if (!idling) {
            moveToTargetPos();
        }

        PVector distanceVec = new PVector(adjustedMouseX, adjustedMouseY);
        distanceVec.sub(pos);
        hovering = distanceVec.mag() < EPISODE_HOVER_DISTANCE;
        if (hovering) {
            highlightedEpisode = episode;
        }
    }

    void moveToTargetPos () {
        if (!startedMovingToPos) {
            startedMovingToPos = true;
            lastMillis = millis();
        }

        PVector diff = new PVector(targetPos.x, targetPos.y);
        diff.sub(pos);
        if (diff.mag() < 3) {
            idling = true;
            pos = targetPos;
        }

        float secDiff = (millis() - lastMillis) / 1000.0;
        lastMillis = millis();

        speed += secDiff * ACCELERATION;
        if (speed > MAX_SPEED) {
            speed = MAX_SPEED;
        }

        if (diff.mag() < 120) {
            speed = min(
                map(diff.mag(), 120, 0, MAX_SPEED, 0),
                speed
            );
        }

        float origMult = diff.mag();
        diff.normalize();
        diff.mult(min(speed * secDiff, origMult));
        pos.add(diff);
    }

    void goTo (PVector newPos) {
        idling = false;
        targetPos = newPos;
        startedMovingToPos = false;
    }

    void draw () {
        pushStyle();
        pushMatrix();

        translate(pos.x, pos.y);
        ellipseMode(RADIUS);

        noStroke();
        ColorSet targetColorSet = SHOW_COLORS.get(episode.getShow());
        fill(hovering ? targetColorSet.getHover() : targetColorSet.getHalo());
        ellipse(0, 0, haloRadius, haloRadius);

        fill(NEAR_BLACK);
        ellipse(0, 0, 1, 1);

        popStyle();
        popMatrix();
    }

    void onPress () { }

    void onRelease () { }
};


void loadGraphicEpisodes () {
    HashMap<String, ArrayList<Episode>> episodes;
    episodes = curDataset.getEpisodes();

    graphicEpisodes = new HashMap<String, ArrayList<EpisodeGraphic>>();

    for (String showName : episodes.keySet()) {
        ArrayList<EpisodeGraphic> graphics = new ArrayList<EpisodeGraphic>();
        
        for (Episode episode : episodes.get(showName)) {
            graphics.add(new EpisodeGraphic(
                DEFAULT_POSITION,
                episode
            ));
        }

        graphicEpisodes.put(showName, graphics);
    }
}
