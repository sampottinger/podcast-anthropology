function AggregationBarChartProto () {

    // Private vars
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

    // Method declaration
    var setAggSettings = function (newGroups, newBucketGranularity,
        newInterval, newStartVal, newMidVal, newUsePercent) {

        groups = newGroups;
        bucketGranularity = newBucketGranularity;
        midVal = newMidVal;
        usePercent = newUsePercent;
        startVal = newStartVal;
        interval = newInterval;
        aggSet = true;
    };

    var setYCoord = function (newStartY) {
        startY = newStartY;
        yCoordSet = true;
    };

    var setXCoord = function (newStartX, newEndX) {
        startScaleX = newStartX;
        endScaleX = newEndX;
        xCoordSet = true;
    };

    var setText = function (newBaseline, newMidVal, newTitle,
        newLabelStrategy) {

        baselineText = newBaseline;
        midValText = newMidVal;
        titleText = newTitle;
        labelStrategy = newLabelStrategy;
        textSet = true;
    };

    var getGroups = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return groups;
    };

    var getBucketGranularity = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return bucketGranularity;
    };

    var getInterval = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return interval;
    };

    var getStartVal = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return startVal;
    };

    var getMidVal  = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return midVal;
    };

    var getUsePercent = function () {
        if (!aggSet) {
            throw "Aggregation settings not provided.";
        }
        return usePercent;
    };

    var getStartY = function() {
        if (!yCoordSet) {
            throw "Y coordinates not provided.";
        }
        return startY;
    };

    var getStartScaleX = function() {
        if (!xCoordSet) {
            throw "X coordinates not provided.";
        }
        return startScaleX;
    };

    var getEndScaleX = function () {
        if (!xCoordSet) {
            throw "X coordinates not provided.";
        }
        return endScaleX;
    };

    var getBaselineText = function () {
        if (!textSet) {
            throw "Text not provided.";
        }
        return baselineText;
    };

    var getMidValText = function () {
        if (!textSet) {
            throw "Text not provided.";
        }
        return midValText;
    };

    var getTitleText = function () {
        if (!textSet) {
            throw "Text not provided.";
        }
        return titleText;
    };

    var getLabelStrategy = function () {
        return labelStrategy;
    };

    // Init
    aggSet = false;
    yCoordSet = false;
    xCoordSet = false;
    textSet = false;

    // Attach public properties
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
}


function AggregationBarChart (proto) {

    // Private vars
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

    // Method declaration
    var draw = function () {
        childrenEntities.forEach(function (e) { e.draw(); });
    };

    var update = function (localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
            e.update(localMouseX, localMouseY);
        });
    };

    var onPress = function (localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
             e.onPress(localMouseX, localMouseY);
        });
    };

    var onRelease = function(localMouseX, localMouseY) {
        childrenEntities.forEach(function(e) {
             e.onRelease(localMouseX, localMouseY);
        });
    };
    
    var createElements = function () {
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
                        curBottomText = nfc(visibleCounts);
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

    var getEndY = function() {
        return endYCoord;
    };

    // Init
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
    createElements();

    // Attach public properties
    this.draw = draw;
    this.update = update;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.createElements = createElements;
    this.getEndY = getEndY;
}
