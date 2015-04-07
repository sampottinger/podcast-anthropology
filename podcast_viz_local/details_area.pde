import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

Episode highlightedEpisode = null;
DateTimeFormatter dateFormatter = DateTimeFormat.forPattern("dd MMM, yyyy");


String getDurText (int seconds) {
    int hours = seconds / 3600;
    seconds = seconds % 3600;
    int minutes = seconds / 60;
    return str(hours) + ":" + nf(minutes, 2);
}


String getDateText (DateTime dateTime) {
    return dateFormatter.print(dateTime);
}


void drawDetailsArea () {
    pushStyle();
    pushMatrix();

    noStroke();
    fill(WHITE);

    rectMode(CORNER);
    rect(0, HEIGHT - DETAILS_AREA_HEIGHT, WIDTH, DETAILS_AREA_HEIGHT);

    if (highlightedEpisode != null) {
        fill(MID_GREY);
        textFont(FONT_12);
        
        int headerY = HEIGHT - 30;
        text("Episode", 10, headerY);
        text("Show", 300, headerY);
        text("Duration", 500, headerY);
        text("Date", 700, headerY);

        int contentY = headerY + 18;
        textFont(FONT_14);
        fill(NEAR_BLACK);
        text(highlightedEpisode.getName(), 10, contentY);
        text(highlightedEpisode.getShow(), 300, contentY);
        text(getDurText(highlightedEpisode.getDur()), 500, contentY);
        text(getDateText(highlightedEpisode.getPubDate()), 700, contentY);
    }

    popStyle();
    popMatrix();
}
