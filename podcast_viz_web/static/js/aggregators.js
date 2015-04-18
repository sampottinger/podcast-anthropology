/**
 * Helper functions and objects to generate histogram-like data.
 *
 * Helper functions and objects which organize data into buckets based off of
 * a numerical description of the data points. This could, for example, organize
 * podcast episodes into buckets based off of episode length.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Interface for objects building histogram-like data structures.
 *
 * Interface for objects that describe histogram-like data structures where the
 * values are placed into buckets where each bucket has a range of values that
 * it will contain. The range for the buckets are all mutually exclusive and
 * each object will only belong ("fit") into one bucket.
 * 
 * @typedef {Object} Aggregator
 *
 * @property {function(): Number} getMaxBucket - Get the value of the "max
 *      bucket" in this histogram-like data structure.
 * @property {function(): Number} getMaxBucketSize - Get the number of members
 *      in the "bucket" that has the largest population.
 * @property {function(): domenic.dict} getBuckets - Get the buckets as a dict
 *      where the dict keys are the values mapping to the bucket and the dict
 *      values are the members of that bucket.
 */


/**
 * Aggregator that organizes data points into month buckets.
 *
 * @constructor
 * @implements {Aggregator}
 */
function MonthAggregator() {
    // -- Private vars --
    var monthCount;

    // -- Method declaration --

    /**
     * @inheritDoc
     */
    var getMaxBucket = function() {
        var globMax = 0;
        getBuckets().forEach(function (value, key) {
            var localMax = parseInt(key, 10);
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    /**
     * @inheritDoc
     */
    var getMaxBucketSize = function() {
        var globMax = 0;
        getBuckets().forEach(function (localMax, key) {
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    /**
     * Process a new data point given its date.
     *
     * Record / represent a new data point by incrementing the count for a given
     * month by one.
     *
     * @param {Date} target - The date of the data point to be recorded.
     */
    var processNewDataPoint = function(target) {
        var monthNum = target.year() * 12 + target.month();

        if (!monthCount.has(monthNum)) {
            monthCount.set(monthNum, 0);
        }

        monthCount.set(
            monthNum,
            monthCount.get(monthNum) + 1
        );
    };

    /**
     * @inheritDoc
     */
    var getBuckets = function() {
        return monthCount;
    };

    // -- Constructor --
    monthCount = dict();

    // -- Attach properties --
    this.getMaxBucket = getMaxBucket;
    this.getMaxBucketSize = getMaxBucketSize;
    this.processNewDataPoint = processNewDataPoint;
    this.getBuckets = getBuckets;
}


/**
 * Aggregator based on the difference between a datum's date and a start date.
 *
 * @constructor
 * @implements {Aggregator}
 *
 * @param {Number} newBucketSize - The size of each histogram bucket in number
 *      of days.
 */
function DifferenceAggregator (newBucketSize) {
    // -- Private vars --
    var differences;
    var lastDatetime;
    var bucketSize;

    // -- Method declaration --

    /**
     * @inheritDoc
     */
    var getMaxBucket = function() {
        var globMax = 0;
        getBuckets().forEach(function (value, key) {
            var localMax = parseInt(key, 10);
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    /**
     * @inheritDoc
     */
    var getMaxBucketSize = function() {
        var globMax = 0;
        getBuckets().forEach(function (localMax, key) {
            globMax = globMax > localMax ? globMax : localMax;
        });
        return globMax;
    };

    /**
     * Process a new data point given its value.
     *
     * Record / represent a new data point by incrementing the count for a given
     * range of dates by one.
     *
     * @param {Date} target - The date of the data point to be recorded.
     */
    var processNewDataPoint = function(target) {
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

    /**
     * @inheritDoc
     */
    var getBuckets = function() {
        return differences;
    };

    // -- Constructor --
    lastDatetime = null;
    differences = dict();
    bucketSize = newBucketSize;

    // -- Attach public properties --
    this.getMaxBucket = getMaxBucket;
    this.getMaxBucketSize = getMaxBucketSize;
    this.processNewDataPoint = processNewDataPoint;
    this.getBuckets = getBuckets;
}


/**
 * Interface for a category within an {Aggregator}.
 *
 * @typedef {Object} AggregatorCategory
 * @property {function({EpisodeGraphic} episode)} processEpisode - Determine if
 *      the provided episode "fits" into this category and, if so, add it to
 *      its list of members.
 * @property {function(): Array<EpisodeGraphic>} getMatchedEpisodes - Get the
 *      episodes that are members of this category.
 */


/**
 * Category describing a range of podcast lengths.
 *
 * Data structure which holds episode graphics, organizing them by the length
 * of the episode in seconds. Note that this category ranges from newMinDuration
 * inclusive to newMaxDuration exclusive.
 *
 * @constructor
 * @implements {AggregatorCategory}
 *
 * @param {Number} newMinDuration - The minimum duration in seconds of
 *      podcast episodes that match or "fit" into this "bucket" or category.
 * @param {Number} newMaxDuration - The maximum duration in seconds of
 *      podcast episodes that match or "fit" into this "bucket" or category.
 */
function DurationAggregationCategory (newMinDuration, newMaxDuration) {
    // -- Private vars --
    var minDuration;
    var maxDuration;
    var episodes;

    // -- Method declaration --

    /**
     * Process an episode.
     *
     * @param {EpisodeGraphic} episodeGraphic - The episode to process.
     */
    var processEpisode = function(episodeGraphic) {
        var candidateDur = episodeGraphic.getEpisode().getDur();
        if (candidateDur >= minDuration && candidateDur < maxDuration) {
            episodes.push(episodeGraphic);
        }
    };
    
    /**
     * Get the episodes that are members of this category.
     *
     * @return {Array<EpisodeGraphic>} The episodes that have a duration greater
     *      than or equal to this category's minimum episode duration and less
     *      than this category's maximum episode duration.
     */
    var getMatchedEpisodes = function() {
        return episodes;
    };

    // -- Constructor --
    minDuration = newMinDuration;
    maxDuration = newMaxDuration;
    episodes = [];

    // -- Attach public properties --
    this.processEpisode = processEpisode;
    this.getMatchedEpisodes = getMatchedEpisodes;
}


/**
 * Category describing a range of episode dates.
 *
 * Data structure which holds episode graphics, organizing them by the date
 * of episode publication. Note that this category ranges from newStartDate
 * inclusive to newEndDate exclusive.
 *
 * @constructor
 * @implements {AggregatorCategory}
 *
 * @param {Date} newStartDate - The minimum date of podcast episodes that match
 *      or "fit" into this "bucket" or category.
 * @param {Number} newEndDate - The maximum date of podcast episodes that match
 *      or "fit" into this "bucket" or category.
 */
function DateAggregationCategory(newStartDate, newEndDate) {
    
    // -- Private vars --
    var startDate;
    var endDate;
    var episodes;

    // -- Method declaration --

    /**
     * Process an episode.
     *
     * @param {EpisodeGraphic} episodeGraphic - The episode to process.
     */
    var processEpisode = function(episodeGraphic) {
        var episode = episodeGraphic.getEpisode();
        var candidateDate = episode.getPubDate();

        var matches = candidateDate.isSame(startDate);
        matches = matches || candidateDate.isAfter(startDate);
        matches = matches && candidateDate.isBefore(endDate);
        if (matches) {
            episodes.push(episodeGraphic);
        }
    };

    /**
     * Sort the episodes within this category by date (in-place).
     */
    var sortEpisodes = function() {
        sortObjArray(episodes);
    };

    /**
     * Get the episodes that are members of this category.
     *
     * @return {Array<EpisodeGraphic>} The episodes that have a date greater
     *     than or equal to this category's minimum episode date while also
     *     less than this category's maximum date.
     */
    var getMatchedEpisodes = function() {
        return episodes;
    };

    /**
     * Get the minimum episode date that matches this category.
     *
     * @return {Date} The minimum allowed date that macthes this category
     *     (inclusive).
     */
    var getStartDate = function() {
        return startDate;
    };

    /**
     * Get the minimum episode date that matches this category.
     *
     * @return {Date} The minimum allowed date that macthes this category
     *     (exclusive).
     */
    var getEndDate = function() {
        return endDate;
    };

    /**
     * Determine if this date category starts before another date category.
     *
     * @param {DateAggregationCategory} other - Category to compare against.
     * @return {Number} 0 if the two categories start on the same date, a
     *      negative value if this category's start date comes before
     *      other's start date, and a positive value if this category's start
     *      date comes after other's start date.
     */
    var compareTo = function(other) {
        return startDate.valueOf() - other.getStartDate().valueOf();
    };

    // -- Constructor --
    episodes = [];
    startDate = newStartDate;
    endDate = newEndDate;

    // -- Public properties --
    this.processEpisode = processEpisode;
    this.sortEpisodes = sortEpisodes;
    this.getMatchedEpisodes = getMatchedEpisodes;
    this.getStartDate = getStartDate;
    this.getEndDate = getEndDate;
    this.compareTo = compareTo;
}


/**
 * Create {SummaryLegend} instances for the provided aggregation categories.
 *
 * @param {Number} x - The x coordinate at which the category graphics will be
 *      drawn.
 * @param {Number} y - The y coordinate at which the category graphics will be
 *      drawn.
 * @param {Number} targetWidth - The width of the category graphics in pixels.
 * @param {AggregatorCategory} categories - The categories for which legends
 *      should be created.
 * @param {Number} legendHeight - How tall the legend should be in pixels.
 */
function createAggCategoriesLegends(x, y, targetWidth, categories,
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