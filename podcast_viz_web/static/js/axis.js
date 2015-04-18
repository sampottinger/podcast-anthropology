/**
 * Helper functions and objects to build axes.
 *
 * Helper functions and objects which help to build / draw lightweight axes for
 * small embedded graphics like histograms.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Interface for objects generating axis labels for data points within a graph.
 *
 * @typedef {Object} LabelStrategy
 *
 * @property {function(Number): String} getLabel - Generate a label for a data
 *      point where the first and only parameter to this function is that
 *      data point's numerical value.
 */

/**
 * Axis label strategy which rounds numeric values.
 *
 * Axis label strategy which simply returns the rounded numeric value for a
 * data point.
 *
 * @constructor
 * @implements {LabelStrategy}
 */
function RawAxisLabelStrategy() {
    
    /**
     * @inheritDoc
     */
    this.getLabel = function(inputVal) {
        return str(round(inputVal));
    };
}


/**
 * Axis label strategy which returns the year for a data point.
 *
 * @constructor
 * @implements {LabelStrategy}
 */
function MonthNumToYearLabelStrategy() {
    
    /**
     * @inheritDoc
     */
    this.getLabel = function(inputVal) {
        var intInputVal = int(inputVal);
        return str(Math.floor(intInputVal / 12));
    };
}


/**
 * Axis which for a horizontal axis of ordinal values.
 *
 * @constructor
 * @implements {GraphicEntity}
 *
 * @param {Number} newX - The x coordinate in pixels at which this axis starts.
 * @param {Number} newY - The y coordinate in pixels at which this axis should
 *      be drawn.
 * @param {Number} newWidth - The width of the axis in pixels.
 * @param {Number} newStart - The minimum numeric value to be shown within this
 *      axis.
 * @param {Number} newEnd - The maximum numeric value to be shown within this
 *      axis.
 * @param {Number} newInterval - The range from the value of the first to
 *      last bucket / value to be shown on this axis.
 * @param {LabelStrategy} newLabelStrategy - Label strategy to use in generating
 *      tick mark text.
 */
function NumberAxis(newX, newY, newWidth, newScale, newStart, newEnd,
    newInterval, newLabelStrategy) {

    // -- Private vars --
    var targetScale;
    var x;
    var y;
    var axisWidth;
    var startVal;
    var endVal;
    var interval;
    var labelStrategy;

    // -- Method declarations --

    /**
     * Draw a dotted horizontal line.
     *
     * @private
     * @param {Number} y - The coordinate at which the dotted line should be
     *      drawn.
     */
    var drawDottedRule = function(y) {
        for (var dotX = 0; dotX < axisWidth; dotX += 4) {
            rect(x + dotX, y, 2, 1);
        }
    };

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    /**
     * @inheritDoc
     */
    var update = function (x, y) { };

    /**
     * @inheritDoc
     */
    var onPress = function (x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function (x, y) { };

    // -- Constructor --
    x = newX;
    y = newY;
    axisWidth = newWidth;
    targetScale = newScale;
    startVal = newStart;
    endVal = newEnd;
    interval = newInterval;
    labelStrategy = newLabelStrategy;

    // -- Attach public members --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Axis label or "tick mark" on an axis.
 *
 * @constructor
 * @implements {GraphicEntity}
 *
 * @param {Number} newX - The left x coordinate of the tick mark.
 * @param {Number} newY - The mid y coordinate of the tick mark.
 * @param {Number} newWidth - The width in pixels of the tick mark.
 * @param {String} newValue - The text that should appear at the tick mark.
 */
function YMarker(newX, newY, newWidth, newValue) {

    // -- Private vars --
    var x;
    var y;
    var value;
    var markerWidth;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
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

    /**
     * @inheritDoc
     */
    var update = function (x, y) { };

    /**
     * @inheritDoc
     */
    var onPress = function (x, y) { };

    /**
     * @inheritDoc
     */
    var onRelease = function (x, y) { };

    // -- Constructor --
    x = newX;
    y = newY;
    value = newValue;
    markerWidth = newWidth;

    // -- Attach public members --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Small legend showing what colors coorespond to what series in a chart.
 *
 * Small display with a square showing a color and a text label appering
 * immediately to the right of it. A sequence of these acts like a small
 * lengend for an embedded chart within the visualization.
 *
 * @constructor
 * @implements {GraphicEntity}
 *
 * @param {Number} newX - The x coordinate in pixels where the legend should be
 *      drawn.
 * @param {Number} newY - The y coordinate in pixels where the lengend should be
 *      drawn.
 * @param {String} newContent - The text of the label to appear to the right
 *      of the chart.
 * @param {String} newColor - The color of the series within the embedded chart.
 */
function TinyLegend(newX, newY, newContent, newColor) {

    // -- Private vars --
    var x;
    var y;
    var content;
    var boxColor;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    // -- Constructor --
    x = newX;
    y = newY;
    content = newContent;
    boxColor = newColor;

    // -- Attach public properties --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}


/**
 * Object describing a colored category within a series.
 *
 * @constructor
 *
 * @param {String} newName - The human-readable name of the series.
 * @param {String} newColor - The color of the series within the visualization.
 * @param {Number} newCount - The number of members that are in this group / 
 *      series.
 */
function SummaryLegendSection(newName, newColor, newCount) {
    // -- Private vars --
    var name;
    var boxColor;
    var count;

    // -- Method declarations --

    /**
     * Get the name of this series.
     *
     * @return {String} Human-readable name of this series.
     */
    var getName = function() {
        return name;
    };

    /**
     * Get the color of this series within the visualization.
     *
     * @return {String} Hex value representing the color of this series within
     *      the visualization.
     */
    var getColor = function() {
        return boxColor;
    };

    /**
     * Get the number of members within this visualization.
     *
     * @return {Number} The number of members within this series.
     */
    var getCount = function() {
        return count;
    };

    // -- Constructor --
    name = newName;
    boxColor = newColor;
    count = newCount;

    // -- Attach public properties --
    this.getName = getName;
    this.getColor = getColor;
    this.getCount = getCount;
}


/**
 * Small lengend showing the color and count for series within a graph.
 *
 * Small legend which shows the color and number of members for a set of series
 * within the visualization.
 *
 * @constructor
 * @implements {GraphicEntity}
 *
 * @param {Number} newX - The x coordinate in pixels where the lengend should
 *      start when drawn.
 * @param {Number} newY - The y coordinate in pixels where the lengend should
 *      start when drawn.
 * @param {String} newContent - The title to give to the legend. This can
 *      describe the chart to which this legend is attached.
 * @param {Array<SummaryLegendSection>} newSections - The series that this
 *      legend should describe. These objects should include the name and color
 *      of each series.
 * @param {LinearScale} newScale - The scale to use when drawing bar charts
 *      within this legend. Note that this scale does not need to match the
 *      scale used in the grpahic to which this graphic is attached.
 */
function SummaryLegend(newX, newY, newContent, newSections, newScale) {

    // -- Private vars
    var x;
    var y;
    var content;
    var sections;
    var innerScale;

    // -- Method declarations --

    /**
     * @inheritDoc
     */
    var draw = function() {
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

    // -- Constructor --
    x = newX;
    y = newY;
    content = newContent;
    sections = newSections;
    innerScale = newScale;

    // -- Attach public properties --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
}
