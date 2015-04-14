function RawAxisLabelStrategy () {
    this.getLabel = function (inputVal) {
        return str(round(inputVal));
    };
}


function MonthNumToYearLabelStrategy () {
    this.getLabel = function (inputVal) {
        var intInputVal = int(inputVal);
        return str(Math.floor(intInputVal / 12));
    };
}


function NumberAxis (newX, newY, newWidth, newScale, newStart, newEnd,
    newInterval, newLabelStrategy) {

    // Private vars
    var targetScale;
    var x;
    var y;
    var axisWidth;
    var startVal;
    var endVal;
    var interval;
    var labelStrategy;


    // Method declarations
    var drawDottedRule = function (y) {
        for (var dotX = 0; dotX < axisWidth; dotX += 4) {
            rect(x + dotX, y, 2, 1);
        }
    };

    var draw = function () {
        push();

        rectMode(CORNER);
        noStroke();
        fill(MID_GREY);

        drawDottedRule(y + 14);

        textSize(10);
        textAlign(CENTER);
        for (var val = startVal; val <= endVal; val += interval) {
            text(
                labelStrategy.getLabel(val),
                targetScale.scale(val),
                y + 11
            );
        }

        pop();
    };

    var update = function (x, y) { };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    // Init
    x = newX;
    y = newY;
    axisWidth = newWidth;
    targetScale = newScale;
    startVal = newStart;
    endVal = newEnd;
    interval = newInterval;
    labelStrategy = newLabelStrategy;

    // Attach public members
    this.drawDottedRule = drawDottedRule;
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function YMarker (newX, newY, newWidth, newValue) {
    // Private vars
    var x;
    var y;
    var value;
    var markerWidth;

    var draw = function () {
        push();

        rectMode(CORNER);
        noStroke();
        fill(LIGHT_GREY);
        rect(x, y, markerWidth, 1);

        textSize(10);
        textAlign(LEFT, CENTER);
        text(value, x + markerWidth + 2, y);

        pop();
    };

    var update = function (x, y) { };

    var onPress = function (x, y) { };

    var onRelease = function (x, y) { };

    // Init
    x = newX;
    y = newY;
    value = newValue;
    markerWidth = newWidth;

    // Attach public members
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function TinyLegend (newX, newY, newContent, newColor) {

    // Private vars
    var x;
    var y;
    var content;
    var boxColor;

    // Method declarations
    var draw = function () {
        push();

        fill(boxColor);
        noStroke();

        rectMode(CORNER);
        fill(boxColor);
        rect(x + 2, y, 7, 7);

        fill(MID_GREY);
        textSize(10);
        textAlign(RIGHT);
        text(content, x - 1, y + 7);

        pop();
    };

    var update = function (x, y) {};
    var onPress = function (x, y) {};
    var onRelease = function (x, y) {};

    // Init
    x = newX;
    y = newY;
    content = newContent;
    boxColor = newColor;

    // Attach public properties
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


function SummaryLegendSection (newName, newColor, newCount) {
    // Private vars
    var name;
    var boxColor;
    var count;

    // Method declarations
    var getName = function () {
        return name;
    };

    var getColor = function () {
        return boxColor;
    };

    var getCount = function () {
        return count;
    };

    // Init
    name = newName;
    boxColor = newColor;
    count = newCount;

    // Attach public properties
    this.getName = getName;
    this.getColor = getColor;
    this.getCount = getCount;
}


function SummaryLegend (newX, newY, newContent, newSections, newScale) {
    // Private vars
    var x;
    var y;
    var content;
    var sections;
    var innerScale;

    // Method declarations
    var draw = function () {
        push();

        noStroke();

        translate(x, y);

        fill(MID_GREY);
        textSize(14);
        textAlign(RIGHT);
        text(content, 0, 0);

        var i = 0;
        textSize(10);
        rectMode(CORNER);
        sections.forEach(function (section) {
            var y = i * 18 + 13;

            fill(EXTRA_LIGHT_GREY);
            rect(-6, y - 11, innerScale.scale(section.getCount()), 13);

            fill(section.getColor());
            rect(-4, y-6, 4, 4);

            fill(MID_GREY);
            text(section.getName(), -6, y);

            i++;
        });

        pop();
    };

    var update = function (x, y) {};
    var onPress = function (x, y) {};
    var onRelease = function (x, y) {};

    // Init 
    x = newX;
    y = newY;
    content = newContent;
    sections = newSections;
    innerScale = newScale;

    // Attach public properties
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}
