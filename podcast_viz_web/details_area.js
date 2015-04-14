var highlightedEpisode = null;
var curBottomText = null;


var getDurText = function (seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    return str(hours) + ":" + nf(minutes, 2);
};


var getDurTextLong = function (seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    return str(hours) + ":" + nf(minutes, 2) + ":" + nf(seconds % 60, 2);
};


var getDateText = function (dateTime) {
    return dateTime.format("dd MMM, yyyy");
};


var drawDetailsArea = function () {
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
