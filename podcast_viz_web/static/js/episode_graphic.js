var graphicEpisodes;


function ShowBubble (newPos, newShow) {
    // Private vars
    var pos;
    var show;
    var bubbleImage;

    // Method declarations
    var update = function (x, y) { };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    var draw = function () {
        push();

        imageMode(CENTER);
        image(bubbleImage, pos.x, pos.y);

        textSize(10);
        noStroke();
        fill(MID_GREY);

        text(str(show.getEpisodes()) + " eps.", pos.x - 20, pos.y + 35);
        text(
            getDurText(show.getDur() / show.getEpisodes()) + " avg",
            pos.x - 20,
            pos.y + 47
        );

        pop();
    };

    // Init
    pos = newPos;
    show = newShow;
    bubbleImage = loadImage(
        "/static/data/" + newShow.getName().replace(/ /g, "").replace(/\%/g, "") + ".png"
    );

    // Attach public members
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.draw = draw;
}


function EpisodeGraphic (newPos, newEpisode) {
    // Private vars
    var pos;
    var targetPos;
    var idlingStrategy;
    var episode;
    var haloRadius;
    var idling;
    var speed;
    var startedMovingToPos;
    var lastMillis;
    var hovering;

    // Method declarations
    var setIdlingStrategy = function (newIdlingStrategy) {
        idlingStrategy = newIdlingStrategy;
    };

    var setPos = function (newPos) {
        pos = new p5.Vector(newPos.x, newPos.y);
    };

    var getPos = function () {
        return new p5.Vector(pos.x, pos.y);
    };

    var update = function (localMouseX, localMouseY) {
        if (idlingStrategy !== null && idling) {
            idlingStrategy.update(this);
        }

        if (!idling) {
            moveToTargetPos();
        }

        var distanceVec = new p5.Vector(localMouseX, localMouseY);
        distanceVec.sub(pos);
        hovering = distanceVec.mag() < EPISODE_HOVER_DISTANCE;
        if (hovering) {
            highlightedEpisode = episode;
        }
    };

    var moveToTargetPos = function () {
        if (!startedMovingToPos) {
            startedMovingToPos = true;
            lastMillis = millis();
            return;
        }

        var diff = new p5.Vector(targetPos.x, targetPos.y);
        diff.sub(pos);
        if (diff.mag() < 1) {
            idling = true;
            setPos(targetPos);
        }

        var secDiff = (millis() - lastMillis) / 1000.0;
        lastMillis = millis();

        speed += secDiff * ACCELERATION;
        if (speed > MAX_SPEED) {
            speed = MAX_SPEED;
        }

        if (diff.mag() < 120) {
            speed = min(
                map(diff.mag(), 120, 0, MAX_SPEED, MIN_SPEED),
                speed
            );
        }

        var origMult = diff.mag();
        diff.normalize();
        diff.mult(min(speed * secDiff, origMult));
        pos.add(diff);
    };

    var goTo = function (newPos) {
        idling = false;
        targetPos = newPos;
        startedMovingToPos = false;
    };

    var draw = function () {
        push();

        translate(pos.x, pos.y);
        ellipseMode(RADIUS);

        noStroke();
        var targetColorSet = SHOW_COLORS.get(episode.getShow());
        fill(hovering ? targetColorSet.getHover() : targetColorSet.getHalo());
        ellipse(0, 0, haloRadius, haloRadius);

        fill(NEAR_BLACK);
        ellipse(0, 0, 1, 1);

        pop();
    };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    var getEpisode = function () {
        return episode;
    };

    var compareTo = function (other) {
        return episode.compareTo(other.getEpisode());
    };

    // Init
    setPos(newPos);
    idlingStrategy = null;
    episode = newEpisode;
    haloRadius = sqrt(HALO_SCALE.scale(episode.getDur()) / PI);
    idling = true;
    speed = 0;

    // Attach public members
    this.setIdlingStrategy = setIdlingStrategy;
    this.setPos = setPos;
    this.getPos = getPos;
    this.update = update;
    this.moveToTargetPos = moveToTargetPos;
    this.goTo = goTo;
    this.draw = draw;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.getEpisode = getEpisode;
    this.compareTo = compareTo;
}


var loadGraphicEpisodes = function () {
    var episodes;
    episodes = curDataset.getEpisodes();

    graphicEpisodes = dict();

    episodes.forEach(function (episodeSet, showName) {
        var graphics = [];
        
        episodes.get(showName).forEach(function (episode) {
            graphics.push(new EpisodeGraphic(
                DEFAULT_POSITION,
                episode
            ));
        });

        graphicEpisodes.set(showName, graphics);
    });

    curCoocurranceMatrix = new CoocurranceMatrix();
    ORDERED_SHOW_NAMES.forEach(function (showName) {
        graphicEpisodes.get(showName).forEach(function (episode) {
            curCoocurranceMatrix.processEpisode(episode);
        });
    });
};
