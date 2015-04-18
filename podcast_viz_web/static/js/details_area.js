/**
 * Logic to run the "details area" which provides detail on hover.
 *
 * Logic to run the "details area" appearing at the bottom of the visualization
 * which explains data points as the user hovers over different visualization
 * elements.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


// TODO(apottinger): Organize this into a class.
var highlightedEpisode = null;
var curBottomText = null;


/**
 * Generate text describing the duration of an episode.
 *
 * Generate text in the form of hours:minutes describing the duration of a
 * podcast episode. For including seconds, use getDurTextLong.
 *
 * @param {Number} seconds - The duration of the episode in seconds.
 * @return {String} Human-readable text describing the length of the episode.
 */
var getDurText = function(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    return str(hours) + ":" + nf(minutes, 2);
};


/**
 * Generate detailed text describing the duration of an episode.
 *
 * Generate text in the form of hours:minutes:seconds describing the duration of
 * a podcast episode. For excluding seconds, use getDurText.
 *
 * @param {Number} seconds - The duration of the episode in seconds.
 * @return {String} Human-readable text describing the length of the episode.
 */
var getDurTextLong = function(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    return str(hours) + ":" + nf(minutes, 2) + ":" + nf(seconds % 60, 2);
};


/**
 * Describe a date using human-readable text.
 *
 * @param {Moment} dateTime - The date for which a date string should be
 *      generated.
 * @return {String} The provided date formatted to a human readable string like
 *      05 June, 2015.
 */
var getDateText = function(dateTime) {
    return dateTime.format("DD MMM, YYYY");
};


/**
 * Driver to re-draw the details area.
 */
var drawDetailsArea = function() {
    push();

    noStroke();
    fill(WHITE);

    rectMode(CORNER);
    rect(0, HEIGHT - DETAILS_AREA_HEIGHT, WIDTH, DETAILS_AREA_HEIGHT);

    if (highlightedEpisode !== null) {
        fill(MID_GREY);
        textSize(12);
        
        var headerY = HEIGHT - 30;
        text("Episode", 10, headerY);
        text("Show", 300, headerY);
        text("Duration", 500, headerY);
        text("Date", 700, headerY);

        var contentY = headerY + 18;
        textSize(14);
        fill(NEAR_BLACK);
        text(highlightedEpisode.getName(), 10, contentY);
        text(highlightedEpisode.getShow(), 300, contentY);
        text(getDurTextLong(highlightedEpisode.getDur()), 500, contentY);
        text(getDateText(highlightedEpisode.getPubDate()), 700, contentY);
    } else if (curBottomText !== null) {
        fill(NEAR_BLACK);
        textSize(12);
        var textY = HEIGHT - 20;
        text(curBottomText, 10, textY);
    }

    pop();
};
