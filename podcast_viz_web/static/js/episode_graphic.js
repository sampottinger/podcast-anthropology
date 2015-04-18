/**
 * Decorators which allow for the graphical representation of data structures.
 *
 * Decorators which allow for the direct graphical representation of instances
 * that make up the visualization's source data.
 *
 * @author Sam Pottinger
 * @license MIT License
 */

var graphicEpisodes;


/**
 * Graphic representing a single podcast.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {p5.Vector} newPos - The position at which this graphic should be
 *      drawn.
 * @param {Show} newShow - The show that this bubble is graphically
 *      representing.
 */
function ShowBubble(newPos, newShow) {
    // -- Private vars -- 
    var pos;
    var show;
    var bubbleImage;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var update = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onPress = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function(x, y) { };

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    // -- Constructor --
    pos = newPos;
    show = newShow;

    // TODO(apottinger): This is pretty fagile kludge-tastic
    bubbleImage = loadImage(
        "/static/data/" + newShow.getName().replace(/ /g, "").replace(/\%/g, "") + ".png"
    );

    // -- Attach public members --
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.draw = draw;
}


/**
 * Strategy describing what an {EpisodeGraphic} should do while "idling".
 *
 * Strategy describing what motion the EpisodeGraphic should exhibit while it
 * is not actively moving to a target position.
 *
 * @typedef {Object} IdlingStrategy
 * @property {function({EpisodeGraphic} graphic)} update - Update a grahphic
 *      to exhibit the this idlying behavior.
 */


/**
 * Graphic representing a single podcast episode.
 *
 * Particle and steering vehicle representing a single podcast episode which can
 * be moved via a simple physics simulation.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {p5js.Vector} newPos - The position at which this graphic should be
 *      drawn. Also represents its current position within the physics
 *      simulation.
 * @param {Episode} newEpisode - The podcast Episode this graphic represents.
 */
function EpisodeGraphic(newPos, newEpisode) {

    // -- Private vars --
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

    // -- Method declarations --

    /**
     * Indicate what this graphic should do while not moving to a target.
     *
     * Indicate what motion this graphic should exhibit while not actively
     * moving towards a target position.
     *
     * @param {IdlingStrategy} newIdlingStrategy - Motion strategy while
     *      "idlying".
     */
    var setIdlingStrategy = function(newIdlingStrategy) {
        idlingStrategy = newIdlingStrategy;
    };

    /**
     * Update the position of this graphic instantly without motion transition.
     *
     * Set the position of this graphic without having it animate towards /
     * steer twoards that position.
     *
     * @param {p5js.Vector} newPos - The new position to give to this graphic.
     */
    var setPos = function(newPos) {
        pos = new p5.Vector(newPos.x, newPos.y);
    };

    /**
     * Get the current position of this graphic.
     *
     * @return {p5js.Vector} The current position of this graphic. Note that
     *      this may not be the target position to which this graphic is
     *      navigating.
     */
    var getPos = function() {
        return new p5.Vector(pos.x, pos.y);
    };

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
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

    /**
     * Have this graphic take a step towards a goal position.
     *
     * @private
     */
    var moveToTargetPos = function() {
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

    /**
     * Set the target position for this graphic.
     *
     * Instruct this graphic to begin animating / moving towards a goal position
     * such that it will "glide" or "steer" towards that target instead of
     * simply "jumping" there.
     *
     * @param {p5js.Vector} newPos - The position to which this graphic should
     *      move.
     */
    var goTo = function(newPos) {
        idling = false;
        targetPos = newPos;
        startedMovingToPos = false;
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    /**
     * @inheritDoc
     */
    var onPress = function(x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function(x, y) { };

    /**
     * @inheritDoc
     */
    var getEpisode = function() {
        return episode;
    };

    /**
     * Delegate to the Episode compareTo function to compare graphics.
     *
     * @param {EpisodeGraphic} other The graphic whose episode should be
     *      compared to this graphic's episode.
     * @return {Number} other The result of comparing this graphic's episode
     *      to the other graphic's episode.
     */
    var compareTo = function(other) {
        return episode.compareTo(other.getEpisode());
    };

    // -- Constructor --
    setPos(newPos);
    idlingStrategy = null;
    episode = newEpisode;
    haloRadius = sqrt(HALO_SCALE.scale(episode.getDur()) / PI);
    idling = true;
    speed = 0;

    // -- Attach public members --
    this.setIdlingStrategy = setIdlingStrategy;
    this.setPos = setPos;
    this.getPos = getPos;
    this.update = update;
    this.goTo = goTo;
    this.draw = draw;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.getEpisode = getEpisode;
    this.compareTo = compareTo;
}


/**
 * Driver function to load {Episode} instances into {GraphicEpisode} instances.
 */
var loadGraphicEpisodes = function() {
    var episodes;
    episodes = curDataset.getEpisodes();

    graphicEpisodes = dict();

    episodes.forEach(function(episodeSet, showName) {
        var graphics = [];
        
        episodes.get(showName).forEach(function(episode) {
            graphics.push(new EpisodeGraphic(
                DEFAULT_POSITION,
                episode
            ));
        });

        graphicEpisodes.set(showName, graphics);
    });

    curCoocurranceMatrix = new CoocurranceMatrix();
    ORDERED_SHOW_NAMES.forEach(function(showName) {
        graphicEpisodes.get(showName).forEach(function(episode) {
            curCoocurranceMatrix.processEpisode(episode);
        });
    });
};
