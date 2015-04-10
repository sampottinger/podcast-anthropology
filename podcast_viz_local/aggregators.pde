import org.joda.time.DateTime;
import org.joda.time.Days;


abstract class Aggregator {
    int getMaxBucket() {
        int globMax = 0;
        for (int localMax : getBuckets().keySet()) {
            globMax = globMax > localMax ? globMax : localMax;
        }
        return globMax;
    }

    int getMaxBucketSize() {
        int globMax = 0;
        for (int localMax : getBuckets().values()) {
            globMax = globMax > localMax ? globMax : localMax;
        }
        return globMax;
    }

    abstract HashMap<Integer, Integer> getBuckets();
};


class MonthAggregator extends Aggregator {
    private HashMap<Integer, Integer> monthCount;

    MonthAggregator () {
        monthCount = new HashMap<Integer, Integer>();
    }

    void processNewDate (DateTime target) {
        int monthNum = target.getYear() * 12 + target.getMonthOfYear();

        if (!monthCount.containsKey(monthNum)) {
            monthCount.put(monthNum, 0);
        }

        monthCount.put(
            monthNum,
            monthCount.get(monthNum) + 1
        );
    }

    HashMap<Integer, Integer> getBuckets() {
        return monthCount;
    }
};


class DifferenceAggregator extends Aggregator {
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
};


interface AggregationCategory {
    void processEpisode (EpisodeGraphic episodeGraphic);
    ArrayList<EpisodeGraphic> getMatchedEpisodes ();
}


class DurationAggregationCategory implements AggregationCategory{
    private int minDuration;
    private int maxDuration;
    private ArrayList<EpisodeGraphic> episodes;

    DurationAggregationCategory (int newMinDuration, int newMaxDuration) {
        minDuration = newMinDuration;
        maxDuration = newMaxDuration;
        episodes = new ArrayList<EpisodeGraphic>();
    }

    void processEpisode (EpisodeGraphic episodeGraphic) {
        int candidateDur = episodeGraphic.getEpisode().getDur();
        if (candidateDur >= minDuration && candidateDur < maxDuration) {
            episodes.add(episodeGraphic);
        }
    }
    
    ArrayList<EpisodeGraphic> getMatchedEpisodes () {
        return episodes;
    }
};


class DateAggregationCategory implements Comparable<DateAggregationCategory>,
    AggregationCategory {

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


ArrayList<SummaryLegend> createAggCategoriesLegends (float x, float y,
    float targetWidth, ArrayList<AggregationCategory> categories,
    float legendHeight, ArrayList<String> labels) {

    ArrayList<ArrayList<SummaryLegendSection>> legendSectionSets;
    legendSectionSets = new ArrayList<ArrayList<SummaryLegendSection>>();

    int maxCount = 0;

    for (AggregationCategory category : categories) {
        ArrayList<SummaryLegendSection> legendSections;
        legendSections = new ArrayList<SummaryLegendSection>();

        HashMap<String, Integer> showCount;
        showCount = new HashMap<String, Integer>();

        for (String showName : ORDERED_SHOW_NAMES) {
            showCount.put(showName, 0);
        }

        for (EpisodeGraphic episode : category.getMatchedEpisodes()) {
            String showName = episode.getEpisode().getShow();
            int newCount = showCount.get(showName) + 1;
            showCount.put(showName, newCount);
            maxCount = maxCount > newCount ? maxCount : newCount;
        }

        for (String showName : ORDERED_SHOW_NAMES) {
            legendSections.add(new SummaryLegendSection(
                showName,
                SHOW_COLORS.get(showName).getFill(),
                showCount.get(showName)
            ));
        }

        legendSectionSets.add(legendSections);
    }

    LinearScale legendScale = new LinearScale(
        0,
        maxCount,
        0,
        targetWidth
    );

    int i = 0;
    ArrayList<SummaryLegend> retLegends = new ArrayList<SummaryLegend>();
    for (ArrayList<SummaryLegendSection> sectionSet : legendSectionSets) {
        retLegends.add(new SummaryLegend(
            x,
            y + i * legendHeight,
            labels.get(i),
            sectionSet,
            legendScale
        ));

        i++;
    }

    return retLegends;
}
