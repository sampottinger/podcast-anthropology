function MonthAggregator () {
    // Private vars
    var monthCount;

    // Method declaration
    var getMaxBucket = function () {
        var globMax = 0;
        getBuckets().forEach(function (value, key) {
            var localMax = parseInt(key, 10);
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    var getMaxBucketSize = function () {
        var globMax = 0;
        getBuckets().forEach(function (localMax, key) {
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    var processNewDate = function (target) {
        var monthNum = target.year() * 12 + target.month();

        if (!monthCount.has(monthNum)) {
            monthCount.set(monthNum, 0);
        }

        monthCount.set(
            monthNum,
            monthCount.get(monthNum) + 1
        );
    };

    var getBuckets = function() {
        return monthCount;
    };

    // Constructor
    monthCount = dict();

    // Attach properties
    this.getMaxBucket = getMaxBucket;
    this.getMaxBucketSize = getMaxBucketSize;
    this.processNewDate = processNewDate;
    this.getBuckets = getBuckets;
}


function DifferenceAggregator (newBucketSize) {
    // Private vars
    var differences;
    var lastDatetime;
    var bucketSize;

    // Method declaration
    var getMaxBucket = function () {
        var globMax = 0;
        getBuckets().forEach(function (value, key) {
            var localMax = parseInt(key, 10);
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    var getMaxBucketSize = function () {
        var globMax = 0;
        getBuckets().forEach(function (localMax, key) {
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    var processNewDate = function (target) {
        if (lastDatetime === null) {
            lastDatetime = target;
            return;
        }

        var daysBetweenRaw = daysBetween(lastDatetime, target);
        var daysBetweenScaled = ceil(daysBetweenRaw / bucketSize) * bucketSize;
        if (!differences.has(daysBetweenScaled)) {
            differences.set(daysBetweenScaled, 0);
        }

        differences.set(
            daysBetweenScaled,
            differences.get(daysBetweenScaled) + 1
        );

        lastDatetime = target;
    };

    var getBuckets = function () {
        return differences;
    };

    // Init
    lastDatetime = null;
    differences = dict();
    bucketSize = newBucketSize;

    // Attach public properties
    this.getMaxBucket = getMaxBucket;
    this.getMaxBucketSize = getMaxBucketSize;
    this.processNewDate = processNewDate;
    this.getBuckets = getBuckets;
}


function DurationAggregationCategory (newMinDuration, newMaxDuration) {
    // Private vars
    var minDuration;
    var maxDuration;
    var episodes;

    // Method declaration
    var processEpisode = function (episodeGraphic) {
        var candidateDur = episodeGraphic.getEpisode().getDur();
        if (candidateDur >= minDuration && candidateDur < maxDuration) {
            episodes.push(episodeGraphic);
        }
    };
    
    var getMatchedEpisodes = function () {
        return episodes;
    };

    // Init
    minDuration = newMinDuration;
    maxDuration = newMaxDuration;
    episodes = [];

    // Attach public properties
    this.processEpisode = processEpisode;
    this.getMatchedEpisodes = getMatchedEpisodes;
}


function DateAggregationCategory (newStartDate, newEndDate) {
    // Private vars
    var startDate;
    var endDate;
    var episodes;

    // Method declaration
    var processEpisode = function (episodeGraphic) {
        var episode = episodeGraphic.getEpisode();
        var candidateDate = episode.getPubDate();

        var matches = candidateDate.isSame(startDate) || candidateDate.isAfter(startDate);
        matches = matches && candidateDate.isBefore(endDate);
        if (matches) {
            episodes.push(episodeGraphic);
        }
    };

    var sortEpisodes = function () {
        sortObjArray(episodes);
    };

    var getMatchedEpisodes = function () {
        return episodes;
    };

    var getStartDate = function () {
        return startDate;
    };

    var getEndDate = function () {
        return endDate;
    };

    var compareTo = function (other) {
        return startDate.valueOf() - other.getStartDate().valueOf();
    };

    // Init
    episodes = [];
    startDate = newStartDate;
    endDate = newEndDate;

    // Public properties
    this.processEpisode = processEpisode;
    this.sortEpisodes = sortEpisodes;
    this.getMatchedEpisodes = getMatchedEpisodes;
    this.getStartDate = getStartDate;
    this.getEndDate = getEndDate;
    this.compareTo = compareTo;
}


function createAggCategoriesLegends (x, y, targetWidth, categories,
    legendHeight, labels) {

    var legendSectionSets = [];
    var maxCount = 0;

    categories.forEach(function (category) {
        var legendSections = [];
        var showCount = dict();

        ORDERED_SHOW_NAMES.forEach(function (showName) {
            showCount.set(showName, 0);
        });

        category.getMatchedEpisodes().forEach(function (episode) {
            var showName = episode.getEpisode().getShow();
            var newCount = showCount.get(showName) + 1;
            showCount.set(showName, newCount);
            maxCount = maxCount > newCount ? maxCount : newCount;
        });

        ORDERED_SHOW_NAMES.forEach(function (showName) {
            legendSections.push(new SummaryLegendSection(
                showName,
                SHOW_COLORS.get(showName).getFill(),
                showCount.get(showName)
            ));
        });

        legendSectionSets.push(legendSections);
    });

    var legendScale = new LinearScale(0, maxCount, 0, targetWidth);

    var i = 0;
    var retLegends = [];
    legendSectionSets.forEach(function (sectionSet) {
        retLegends.push(new SummaryLegend(
            x,
            y + i * legendHeight,
            labels[i],
            sectionSet,
            legendScale
        ));

        i++;
    });

    return retLegends;
}