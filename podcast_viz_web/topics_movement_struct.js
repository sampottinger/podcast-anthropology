function CachedTopic (newTopic, newCount) {
    // Private vars
    var topic;
    var count;

    // Method declrations
    var getTopic = function () {
        return topic;
    };

    var getCount = function () {
        return count;
    };

    var compareTo = function (other) {
        return count - other.getCount();
    };

    // Init
    topic = newTopic;
    count = newCount;

    // Attach public members
    this.getTopic = getTopic;
    this.getCount = getCount;
    this.compareTo = compareTo;
}


function GraphicalTopic (newTopic, newBarScale, newPos) {
    // Private vars
    var topic;
    var barScale;
    var pos;
    var cachedBarWidth;
    var isHovering;
    var isActive;

    // Method declarations
    var update = function (localMouseX, localMouseY) {
        isHovering = localMouseX > pos.x - 70;
        isHovering = isHovering && localMouseX < pos.x + 100;
        isHovering = isHovering && localMouseY > pos.y;
        isHovering = isHovering && localMouseY < pos.y + 11;

        preventDefaultCursor = true;
        cursor(HAND);
    };

    var onPress = function (localMouseX, localMouseY) {
        update(localMouseX, localMouseY);
        isActive = isHovering;

        if (isActive) {
            selectedTopic = topic.getTopic();
            topicsDisplayDirty = true;
            selectTopic(topic.getTopic());
        }
    };

    var onRelease = function (localMouseX, localMouseY) {

    };

    var draw = function () {
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

    // Init
    topic = newTopic;
    barScale = newBarScale;
    pos = newPos;
    cachedBarWidth = barScale.scale(topic.getCount());
    isHovering = false;
    isActive = false;

    // Attach public members
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.draw = draw;
}


function CachedArcs (newX, newY, newHeight, newArcs) {
    // Private vars
    var x;
    var y;
    var graphicsCache;
    var cacheHeight;
    var arcs;
    var active;

    // Method declarations
    var updateCache = function () {
        graphicsCache = createGraphics(WIDTH, int(cacheHeight) + 50);
        arcs.forEach(function (newArc) {
            newArc.drawBg(graphicsCache);
        });
        arcs.forEach(function (newArc) {
            newArc.drawFg(graphicsCache);
        });

        topicsDisplayDirty = false;
    };

    var draw = function () {
        if (!active) {
            return;
        }

        if (topicsDisplayDirty || graphicsCache === null) {
            updateCache();
        }

        image(graphicsCache, x, y);
    };

    var update = function (x, y) {};
    var onPress = function (x, y) {};
    var onRelease = function (x, y) {};

    var setActive = function (newActiveState) {
        active = newActiveState;
    };

    // Init
    x = newX;
    y = newY;
    graphicsCache = null;
    cacheHeight = newHeight;
    arcs = newArcs;
    active = true;

    // Attach public members
    this.updateCache = updateCache;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.setActive = setActive;
}


function OverlapArc (newStartY, newEndY, newOverlapSize, newOverlapScale,
    newTopic1, newTopic2) {

    // Private vars
    var startY;
    var endY;
    var overlapSize;
    var overlapScale;
    var topic1;
    var topic2;

    // Method declarations
    var isSelected = function () {
        var isSelected;
        if (selectedTopic === null) {
            isSelected = false;
        } else {
            isSelected = selectedTopic === topic1;
            isSelected = isSelected || selectedTopic === topic2;
        }

        return isSelected;
    };

    var drawFg = function (targetContext) {
        if (isSelected()) {
            drawArc(targetContext, NEAR_BLACK);
        }
    };

    var drawArc = function (targetContext, targetColor) {
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

    var drawBg = function (targetContext) {
        if (!isSelected()) {
            drawArc(targetContext, MID_GREY_TRANSPARENT);
        }
    };

    // Init
    startY = newStartY;
    endY = newEndY;
    overlapSize = newOverlapSize;
    overlapScale = newOverlapScale;
    topic1 = newTopic1;
    topic2 = newTopic2;

    // Attach public members
    this.isSelected = isSelected;
    this.drawFg = drawFg;
    this.drawArc = drawArc;
    this.drawBg = drawBg;
}
