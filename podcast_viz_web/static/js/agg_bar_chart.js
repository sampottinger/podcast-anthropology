/**
 * Objects to build histograms or histogram-like graphics.
 *
 * Objects to build histograms or other graphics which show the size of groups
 * (like number of 30 minute episodes) within a population (like all of the
 * Radiolab podcasts).
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Prototype describing how to create a histogram or histogram-like graphic.
 *
 * An object describing how a future histogram should be created. For example,
 * this prototype pattern will be read by another object like
 * AggregationBarChart which will use this info to shows the counts for
 * different groups (like number of 30 minute episodes) within a population
 * (like all of the Radiolab podcasts).
 *
 * @constructor
 */
function AggregationBarChartProto() {

    // -- Private vars --
    var aggSet;
    var groups;
    var bucketGranularity;
    var interval;
    var startVal;
    var midVal;
    var usePercent;

    var yCoordSet;
    var startY;

    var xCoordSet;
    var startScaleX;
    var endScaleX;

    var textSet;
    var baselineText;
    var midValText;
    var titleText;
    var labelStrategy;
    var contextStrategy;

    // -- Method declaration --

    /**
     * Indicate how entries in the collection should be aggregated.
     *
     * Specify how groups should be created within the population for which
     * this chart is being generated. The aggregator will make a histogram
     * from the values provided to it via DifferenceAggregator.
     *
     * @param {domenic.dict} newGroups - Dict whose values make up the
     *      population that will be visualized by this prototype's reader. The
     *      values should be of type {Aggregator}.
     * @param {Number} newBucketGranularity - The range of the set of values
     *      that map to each bucket. For example, an aggregator that has buckets
     *      for values 15 through 25 and 25 through 35 would have a bucket
     *      granularity of 10.
     * @param {Number} newInterval - The range of values appearing in the
     *      histogram. For example, an aggregator that has buckets
     *      for values 15 through 25 and 25 through 35 would have an interval of
     *      20.
     * @param {Number} newStartVal - The smallest bucket value appearing in
     *      the histogram. For example, an aggregator that has buckets
     *      for values 15 through 25 and 25 through 35 would have a start value
     *      of 15.
     * @param {Number} newMidVal - The histogram axis will show the minimum,
     *      mid, and possibly maximum value. This is the value that the
     *      histogram should show for its "mid" point.
     * @param {boolean} newUsePercent - Boolean flag indicating if the histogram
     *      will show percentages or raw counts. Flag value of true indicates
     *      that the histogram will show percentages. Value of false indicates
     *      that raw counts will be displayed.
     */
    var setAggSettings = function(newGroups, newBucketGranularity,
        newInterval, newStartVal, newMidVal, newUsePercent) {

        groups = newGroups;
        bucketGranularity = newBucketGranularity;
        midVal = newMidVal;
        usePercent = newUsePercent;
        startVal = newStartVal;
        interval = newInterval;
        
        aggSet = true;
    };

    /**
     * Indicate how hover user help messages should be generated.
     *
     * @param {ContextStrategy} newTextStrategy - Strategy which generates user
     *      help text messages on mouse hover for data points within the
     *      histogram.
     */
    var setContextStrategy = function(newTextStrategy) {
        contextStrategy = newTextStrategy;
    };

    /**
     * Indicate at what y coordinate the histrogram should be drawn.
     *
     * @param {Number} newStartY - The y coordinate in pixels where the
     *      histogram should be drawn.
     */
    var setYCoord = function(newStartY) {
        startY = newStartY;
        yCoordSet = true;
    };

    /**
     * Indicate at what x coordinate the histogram should be drawn.
     *
     * Indicate where the histogram should start and stop horizontally by
     * providing the starting and ending x coordinates for the graphic.
     *
     * @param {Number} newStartX - The x coordinate at which the graph will
     *      start.
     * @param {Number} newEndX - The x coordinate to which the graph will
     *      extend.
     */
    var setXCoord = function(newStartX, newEndX) {
        startScaleX = newStartX;
        endScaleX = newEndX;
        xCoordSet = true;
    };

    /**
     * Set the text of the labels appearing within the graph.
     *
     * @param {String} newBaseline - The text to appear at the "zero" position
     *      within the graph axis. For a graph showing percentages, this might
     *      be "0%".
     * @param {String} newMidVal - The text to appear at the "mid" position
     *      within the the graph axis. For a graph showing percentages, this
     *      might be "50%".
     * @param {String} newTitle - The title for the whole graphic.
     * @param {LabelStrategy} newLabelStrategy - Strategy to build axis labels
     *      for data points within the chart.
     */
    var setText = function(newBaseline, newMidVal, newTitle,
        newLabelStrategy) {

        baselineText = newBaseline;
        midValText = newMidVal;
        titleText = newTitle;
        labelStrategy = newLabelStrategy;
        textSet = true;
    };

    /**
     * Get the strategy to build axis labels for data points within the chart.
     *
     * @return {LabelStrategy} - Strategy to generate axis label text.
     */
    var getContextStrategy = function() {
        return contextStrategy;
    };

    /**
     * Get the groups to be visualized in the graphic.
     *
     * @return {domenic.dict} Dict whose values make up the population that will
     *      be visualized by this prototype's reader. The values will be of
     *      type {Aggregator}.
     */
    var getGroups = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return groups;
    };

    /**
     * Get the range of each bucket's values within the histogram.
     *
     * @return {Number} The range of the set of values that map to each bucket.
     *      For example, an aggregator that has buckets for values 15 through 25
     *      and 25 through 35 would have a bucket granularity of 10.
     */
    var getBucketGranularity = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return bucketGranularity;
    };

    /**
     * Get the range of all bucket values within the histogram.
     *
     * @return {Number} The range of values appearing in the histogram. For
     *      example, an aggregator that has buckets for values 15 through 25 and
     *      25 through 35 would have an interval of 20.
     */
    var getInterval = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return interval;
    };

    /**
     * Get the value of the first bucket appearing in the histogram.
     *
     * @return {Number} The smallest bucket value appearing in the histogram.
     *      For example, an aggregator that has buckets for values 15 through 25
     *      and 25 through 35 would have a start value of 15.
     */
    var getStartVal = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return startVal;
    };

    /**
     * Get the value displayed in the axis as the histogram "mid" value.
     *
     * @return {Number} The histogram axis will show the minimum, mid, and
     *      possibly maximum value. This is the value that the histogram should
     *      show for its "mid" point.
     */
    var getMidVal  = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return midVal;
    };

    /**
     * Determine if this histogram is showing counts as percentages or not.
     *
     * @return {boolean} - Flag indicating if the histogram will show
     *      percentages or raw counts. Flag value of true indicates that the
     *      histogram will show percentages. Value of false indicates that raw
     *      counts will be displayed.
     */
    var getUsePercent = function() {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return usePercent;
    };

    /**
     * Get the y value at which this histogram should be drawn.
     *
     * @return {Number} The y coordinate in pixels where the histogram should be
     *      drawn.
     */
    var getStartY = function() {
        if (!yCoordSet) {
            throw "Y coordinates not provided.";
        }
        return startY;
    };

    /**
     * The x coordinate at which this histogram starts.
     *
     * @return {Number} The x coordinate in pixels at which this histogram will
     *      start.
     */
    var getStartScaleX = function() {
        if (!xCoordSet) {
            throw "X coordinates not provided.";
        }
        return startScaleX;
    };

    /**
     * The x coordinate at which this histogram ends.
     *
     * @return {Number} The x coordinate in pixels to which this histogram will
     *     extend.
     */
    var getEndScaleX = function() {
        if (!xCoordSet) {
            throw "X coordinates not provided.";
        }
        return endScaleX;
    };

    /**
     * Get the text to appear at the bottom of the histogram's axis.
     *
     * @return {String} Text for the label at the "zero" or "base" of the
     *      histogram's axis.
     */
    var getBaselineText = function() {
        if (!textSet) {
            throw "Text not provided.";
        }
        return baselineText;
    };

    /**
     * Get the text to appear in the middle of the histogram's axis.
     *
     * @return {String} Text for the label in the middle of the histogram's
     *      axis.
     */
    var getMidValText = function() {
        if (!textSet) {
            throw "Text not provided.";
        }
        return midValText;
    };

    /**
     * Get the text that should appear in the histogram's title.
     *
     * @return {String} Text to appear in the histogram's title.
     */
    var getTitleText = function() {
        if (!textSet) {
            throw "Text not provided.";
        }
        return titleText;
    };

    /**
     * Get the strategy for building axis labels.
     *
     * @return {LabelStrategy} The strategy for building axis labels for data
     *      points within the chart.
     */
    var getLabelStrategy = function() {
        return labelStrategy;
    };

    // -- Constructor --
    aggSet = false;
    yCoordSet = false;
    xCoordSet = false;
    textSet = false;

    // -- Attach public properties --
    this.setAggSettings = setAggSettings;
    this.setYCoord = setYCoord;
    this.setXCoord = setXCoord;
    this.setText = setText;
    this.getGroups = getGroups;
    this.getBucketGranularity = getBucketGranularity;
    this.getInterval = getInterval;
    this.getStartVal = getStartVal;
    this.getMidVal = getMidVal;
    this.getUsePercent = getUsePercent;
    this.getStartY = getStartY;
    this.getStartScaleX = getStartScaleX;
    this.getEndScaleX = getEndScaleX;
    this.getBaselineText = getBaselineText;
    this.getMidValText = getMidValText;
    this.getTitleText = getTitleText;
    this.getLabelStrategy = getLabelStrategy;
    this.setContextStrategy = setContextStrategy;
    this.getContextStrategy = getContextStrategy;
}


/**
 * Histogram showing the size of groups within a population.
 *
 * Histogram whose x axis shows buckets of values (like the length of a podcast)
 * and whose y axis shows the number of members in each bucket (like the number
 * of podcasts with the given length).
 *
 * @constructor
 * @implements {GraphicEntity}
 *
 * @param {AggregationBarChartProto} proto - Prototype with information about
 *      the histogram that should be drawn.
 */
function AggregationBarChart(proto) {

    // -- Private vars --
    var groups;
    var startY;
    var startVal;
    var startScaleX;
    var endScaleX;
    var interval;
    var bucketGranularity;
    var baselineText;
    var midVal;
    var midValText;
    var titleText;
    var usePercent;
    var childrenEntities;
    var labelStrategy;
    var endYCoord;
    var contextStrategy;

    // -- Method declaration --

    /**
     * @inheritdoc
     */
    var draw = function() {
        childrenEntities.forEach(function (e) { e.draw(); });
    };

    /**
     * @inheritdoc
     */
    var update = function(localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
            e.update(localMouseX, localMouseY);
        });
    };

    /**
     * @inheritdoc
     */
    var onPress = function(localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
             e.onPress(localMouseX, localMouseY);
        });
    };

    /**
     * @inheritdoc
     */
    var onRelease = function(localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
             e.onRelease(localMouseX, localMouseY);
        });
    };
    
    /**
     * Initalize graph state with child (constituent) graphic elements.
     *
     * Initalize the graph's internal state when the drawing surface and data
     * become available. This will also generate all of the "children" graphic
     * elements that make up this graphic.
     *
     * @private
     */
    var createElements = function() {
        var i;
        var bodyStartY = startY + 18;

        // Build scales
        var maxKey = 0;
        var maxBucketSize = 0;
        groups.forEach(function(agg, key) {
            var aggMax = agg.getMaxBucket();
            var sizeMax = agg.getMaxBucketSize();
            maxKey = maxKey > aggMax ? maxKey : aggMax;
            maxBucketSize = maxBucketSize > sizeMax ? maxBucketSize : sizeMax;
        });

        var xScale = new LinearScale(
            startVal,
            maxKey,
            startScaleX,
            endScaleX
        );

        var yScale = new LinearScale(
            usePercent ? 1 : 0,
            usePercent ? 100 : maxBucketSize,
            -1,
            -25
        );

        var barWidth = xScale.scale(bucketGranularity) - xScale.scale(0);

        // Create bars
        i = 1;
        ORDERED_SHOW_NAMES.forEach(function (showName) {
            var y = 30 * i + bodyStartY;
            var numEpisdes = curDataset.getEpisodes().get(showName).length;

            childrenEntities.push(new YMarker(
                startScaleX,
                y,
                endScaleX - startScaleX + 10,
                baselineText
            ));

            childrenEntities.push(new YMarker(
                endScaleX + 10,
                y + yScale.scale(midVal),
                3,
                midValText
            ));

            var counts = groups.get(showName).getBuckets();

            counts.forEach(function (value, key) {
                var diff = parseInt(key, 10);

                var x = xScale.scale(diff);
                
                var barVal;
                if (usePercent) {
                    barVal = (counts.get(diff) / numEpisdes) * 100;
                } else {
                    barVal = counts.get(diff);
                }
                var barHeight = yScale.scale(barVal);
                
                var visibleCounts = counts.get(diff);
                var newListener = {
                    hovering: function () {
                        if (contextStrategy == null) {
                            curBottomText = nfc(visibleCounts);
                        } else {
                            curBottomText = contextStrategy.generateMessage(
                                diff - startVal,
                                barVal
                            );
                        }
                    }
                };

                var newRect = new StaticRect(
                    x,
                    y,
                    barWidth - 1,
                    barHeight,
                    MID_GREY,
                    NEAR_BLACK
                );
                newRect.setHoverListener(newListener);
                childrenEntities.push(newRect);
            });
            i++;
        });

        // Create title
        childrenEntities.push(new Title(
            5,
            startY - 18,
            WIDTH,
            titleText
        ));

        // Create axes
        childrenEntities.push(new NumberAxis(
            TIMELINE_GROUP_START_X + 20,
            bodyStartY - 20,
            endScaleX - startScaleX + barWidth,
            xScale,
            startVal,
            maxKey,
            interval,
            labelStrategy
        ));

        endYCoord = 30 * (i + 1) + bodyStartY;
    };

    /**
     * Get the y coordinate to which this graph extends.
     *
     * @return {Number} The y coordiante to which this graph extends.
     */
    var getEndY = function() {
        return endYCoord;
    };

    // -- Constructor --
    groups = proto.getGroups();
    bucketGranularity = proto.getBucketGranularity();
    startVal = proto.getStartVal();
    midVal = proto.getMidVal();
    usePercent = proto.getUsePercent();
    startY = proto.getStartY();
    startScaleX = proto.getStartScaleX();
    endScaleX = proto.getEndScaleX();
    baselineText = proto.getBaselineText();
    midValText = proto.getMidValText();
    titleText = proto.getTitleText();
    labelStrategy = proto.getLabelStrategy();
    interval = proto.getInterval();
    childrenEntities = [];
    contextStrategy = proto.getContextStrategy();
    createElements();

    // -- Attach public properties --
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.getEndY = getEndY;
}
