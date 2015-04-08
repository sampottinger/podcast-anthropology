import org.joda.time.DateTime; 


class DateAggregationCategory implements Comparable<DateAggregationCategory> {

    private DateTime startDate;
    private DateTime endDate;
    private ArrayList<EpisodeGraphic> episodes;

    DateAggregationCategory (DateTime newStartDate, DateTime newEndDate) {
        episodes = new ArrayList<EpisodeGraphic>();
        startDate = newStartDate;
        endDate = newEndDate;
    }

    void processEpisode (EpisodeGraphic episodeGraphic) {
        Episode episode = episodeGraphic.getEpisode();
        DateTime candidateDate = episode.getPubDate();

        boolean matches = candidateDate.compareTo(startDate) >= 0;
        matches = matches && candidateDate.compareTo(endDate) < 0;
        if (matches) {
            episodes.add(episodeGraphic);
        }
    }

    void sortEpisodes () {
        Collections.sort(episodes);
    }

    ArrayList<EpisodeGraphic> getMatchedEpisodes () {
        return episodes;
    }

    DateTime getStartDate () {
        return startDate;
    }

    DateTime getEndDate () {
        return endDate;
    }

    int compareTo (DateAggregationCategory other) {
        return startDate.compareTo(other.getStartDate());
    }
};
