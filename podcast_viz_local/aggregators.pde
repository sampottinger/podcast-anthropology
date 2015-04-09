import org.joda.time.DateTime;
import org.joda.time.Days;


interface Aggregator {
    int getMaxBucket();
    int getMaxBucketSize();
    HashMap<Integer, Integer> getBuckets();
}


class DifferenceAggregator implements Aggregator {
    private HashMap<Integer, Integer> differences;
    private DateTime lastDatetime;
    private int bucketSize;

    DifferenceAggregator (int newBucketSize) {
        lastDatetime = null;
        differences = new HashMap<Integer, Integer>();
        bucketSize = newBucketSize;
    }

    void processNewDate (DateTime target) {
        if (lastDatetime == null) {
            lastDatetime = target;
            return;
        }

        float daysBetween = Days.daysBetween(lastDatetime, target).getDays();
        int daysBetweenScaled = ceil(daysBetween / bucketSize) * bucketSize;
        if (!differences.containsKey(daysBetweenScaled)) {
            differences.put(daysBetweenScaled, 0);
        }

        differences.put(
            daysBetweenScaled,
            differences.get(daysBetweenScaled) + 1
        );

        lastDatetime = target;
    }

    HashMap<Integer, Integer> getBuckets() {
        return differences;
    }

    int getMaxBucket() {
        int globMax = 0;
        for (int localMax : differences.keySet()) {
            globMax = globMax > localMax ? globMax : localMax;
        }
        return globMax;
    }

    int getMaxBucketSize() {
        int globMax = 0;
        for (int localMax : differences.values()) {
            globMax = globMax > localMax ? globMax : localMax;
        }
        return globMax;
    }
};


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
