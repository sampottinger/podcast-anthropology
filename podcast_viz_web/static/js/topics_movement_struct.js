/**
 * Support data structures and logic for the topics movement.
 *
 * Supporting data structures and logic which help run the topics movement, a
 * view into the data showing the topics discussed across podcasts. The main
 * logic for this movement is in topics_movement.js.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Simple object which caches the the number of episodes talking about a topic.
 *
 * @constructor
 * @param {String} newTopic - The name of the topic discussed.
 * @param {Number} newCount - The number of episodes discussing the topic.
 */
function CachedTopic(newTopic, newCount) {
    // -- Private vars --
    var topic;
    var count;

    // -- Method declrations --

    /**
     * Get the name of the topic discussed.
     *
     * @return {String} The name of the topic discussed.
     */
    var getTopic = function() {
        return topic;
    };

    /**
     * Get the number of the episodes within the topic.
     *
     * @return {Number} The number of episodes across all podcasts that
     *      discussed this topic.
     */
    var getCount = function() {
        return count;
    };

    /**
     * Compare this topic to another by the number of episodes about each.
     *
     * @param {CachedTopic} other - The topic to compare against.
     * @return {Number} A negative number if this topic was discussed in fewer
     *      episodes than other, zero if both topics were discussed equally,
     *      and a positive number if this topic was discussed in more episodes
     *      than other.
     */
    var compareTo = function(other) {
        return count - other.getCount();
    };

    // -- Constructor --
    topic = newTopic;
    count = newCount;

    // -- Attach public members --
    this.getTopic = getTopic;
    this.getCount = getCount;
    this.compareTo = compareTo;
}


/**
 * Graphical representation of a cached topic.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {CachedTopic} newTopic - The topic that this graphic represents.
 * @param {LinearScale} newBarScale - Scale for drawing bars showing the number
 *      of episodes discussing this topic.
 * @param {p5js.Vector} newPos - The position at which this graphic should be
 *      drawn.
 */
function GraphicalTopic(newTopic, newBarScale, newPos) {

    // -- Private vars --
    var topic;
    var barScale;
    var pos;
    var cachedBarWidth;
    var isHovering;
    var isActive;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var update = function(localMouseX, localMouseY) {
        isHovering = localMouseX > pos.x - 70;
        isHovering = isHovering && localMouseX < pos.x + 100;
        isHovering = isHovering && localMouseY > pos.y;
        isHovering = isHovering && localMouseY < pos.y + 11;

        preventDefaultCursor = true;
        cursor(HAND);
    };

    /**
     * @inheritDoc
     */
    var onPress = function(localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        isActive = isHovering;

        if (isActive) {
            selectedTopic = topic.getTopic();
            topicsDisplayDirty = true;
            selectTopic(topic.getTopic());
        }
    };

    /**
     * @inheritDoc
     */
    var onRelease = function(localMouseX, localMouseY) {

    };

    /**
     * @inheritDoc
     */
    var draw = function() {
        push();

        translate(pos.x, pos.y);

        fill(isHovering || isActive ? DARK_GREY : MID_GREY);
        noStroke();

        textSize(10);
        textAlign(RIGHT);
        text(topic.getTopic(), 0, 10);

        rectMode(CORNER);
        fill(isHovering || isActive ? MID_GREY : LIGHT_GREY);
        rect(2, 6, 98, 1);

        rect(2, 4, cachedBarWidth, 5);

        pop();
    };

    // -- Constructor --
    topic = newTopic;
    barScale = newBarScale;
    pos = newPos;
    cachedBarWidth = barScale.scale(topic.getCount());
    isHovering = false;
    isActive = false;

    // -- Attach public members --
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.draw = draw;
}


/**
 * A set of arcs whose dimensions have been pre-calcualted.
 *
 * A set of arcs whose dimensions and other drawn properties have been pre-
 * calculated and whose actual drawing has been cached via p5js' createGraphics.
 *
 * @constructor
 * @implements {GraphicEntity}
 * @param {Number} newX - The x coordinate of the left side of the arcs'
 *      "envelope" (convex hull bounding box).
 * @param {Number} newY - The y coordinate of the top of the arcs' "envelope"
 *      (convex hull bounding box).
 * @param {Number} newHeight - The height of the arcs' "envelope" (convex hull
 *      bounding box).
 * @param {Array<OverlapArc>} newArcs - The member arcs of this cached set.
 */
function CachedArcs (newX, newY, newHeight, newArcs) {

    // -- Private vars --
    var x;
    var y;
    var graphicsCache;
    var cacheHeight;
    var arcs;
    var active;

    // -- Method declarations --

    /**
     * Redraw the off-screen graphics showing this collection's arcs.
     */
    var updateCache = function() {
        graphicsCache = createGraphics(WIDTH, int(cacheHeight) + 50);
        arcs.forEach(function(newArc) {
            newArc.drawBg(graphicsCache);
        });
        arcs.forEach(function(newArc) {
            newArc.drawFg(graphicsCache);
        });

        topicsDisplayDirty = false;
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
        if (!active) {
            return;
        }

        if (topicsDisplayDirty || graphicsCache === null) {
            updateCache();
        }

        image(graphicsCache, x, y);
    };

    /**
     * @inheritDoc
     */
    var update = function(x, y) {};

    /**
     * @inheritDoc
     */
    var onPress = function(x, y) {};

    /**
     * @inheritDoc
     */
    var onRelease = function(x, y) {};

    /**
     * Indicate if this set of arcs should be drawn to the screen or not.
     *
     * @param {boolean} newActiveState - Flag indicating if these arcs should
     *      be drawn to the screen or not. True indicates that they should be
     *      drawn and false indicates that they should be hidden, turning the
     *      draw function into a no-op.
     */
    var setActive = function(newActiveState) {
        active = newActiveState;
    };

    // -- Constructor --
    x = newX;
    y = newY;
    graphicsCache = null;
    cacheHeight = newHeight;
    arcs = newArcs;
    active = true;

    // -- Attach public members --
    this.updateCache = updateCache;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.setActive = setActive;
}


/**
 * Single arc in the co-occurance display.
 *
 * Arc in the co-occurance display showing how many episodes discussed a set of
 * topics during the same episode.
 *
 * @constructor
 * @param {Number} newStartY - The top "y" coordinate of the bounding box for
 *      the arc in pixels.
 * @param {Number} newEndY - The bottom "y" coordinate of the bounding box for
 *      the arc in pixels.
 * @param {Number} newOverlapSize - How many episodes discussed the two topics
 *      connected by this arc.
 * @param {LinearScale} newOverlapScale - Scale whose domain are number of
 *      shared episodes and whose range is the stroke width of the arc.
 * @param {String} newTopic1 - The name of the first topic connected by this
 *      arc.
 * @param {String} newTopic2 - The name of the second topic connected by this
 *      arc.
 */
function OverlapArc(newStartY, newEndY, newOverlapSize, newOverlapScale,
    newTopic1, newTopic2) {

    // -- Private vars --
    var startY;
    var endY;
    var overlapSize;
    var overlapScale;
    var topic1;
    var topic2;

    // -- Method declarations --

    /** 
     * Determine if the user has selected either topic in this arc.
     *
     * Determine if the user has selected (clicked on / made active) one of
     * topics at either end of this arc.
     *
     * @return {boolean} If either topic connected by this arc is selected by
     *      the user.
     */
    var isSelected = function() {
        var isSelected;
        if (selectedTopic === null) {
            isSelected = false;
        } else {
            isSelected = selectedTopic === topic1;
            isSelected = isSelected || selectedTopic === topic2;
        }

        return isSelected;
    };

    /**
     * Draw the foreground of this arc.
     *
     * Draw the foreground of this arc where the background is the transparent
     * version of the arc and the foreground, if the arc is selected, shows
     * the arc filled in solid. If the arc is not selected, this is a no-op.
     *
     * @param {p5js.p5} targetContext The graphics context in which the arc
     *      should be drawn.
     */
    var drawFg = function(targetContext) {
        if (isSelected()) {
            drawArc(targetContext, NEAR_BLACK);
        }
    };

    /**
     * Draws this arc in either the foreground or background.
     *
     * @private
     * @param {p5js.p5} targetContext The graphics context in which the arc
     *      should be drawn.
     * @param {p5js.color} targetColor - The color in whcih the arc should be
     *      drawn.
     */
    var drawArc = function(targetContext, targetColor) {
        targetContext.push();

        targetContext.noFill();
        targetContext.ellipseMode(CENTER);

        targetContext.stroke(targetColor);

        targetContext.strokeWeight(overlapScale.scale(overlapSize));
        targetContext.arc(
            WIDTH - 245,
            (startY + endY) / 2.0,
            20 + Math.abs(endY - startY) / 5.2,
            endY - startY,
            -PI / 2,
            PI / 2
        );

        targetContext.pop();
    };

    /**
     * Draw the background of this arc.
     *
     * Draw the background of this arc where the background is the transparent
     * version of the arc and the foreground, if the arc is selected, the
     * foreground the arc filled in solid.
     *
     * @param {p5js.p5} targetContext The graphics context in which the arc
     *      should be drawn.
     */
    var drawBg = function(targetContext) {
        if (!isSelected()) {
            drawArc(targetContext, MID_GREY_TRANSPARENT);
        }
    };

    // -- Constructor --
    startY = newStartY;
    endY = newEndY;
    overlapSize = newOverlapSize;
    overlapScale = newOverlapScale;
    topic1 = newTopic1;
    topic2 = newTopic2;

    // -- Attach public members -- 
    this.isSelected = isSelected;
    this.drawFg = drawFg;
    this.drawBg = drawBg;
}
