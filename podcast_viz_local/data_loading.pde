import org.joda.time.DateTime;
import java.util.Collections;
import java.util.Arrays;
import java.util.HashSet;

Dataset curDataset;
CoocurranceMatrix curCoocurranceMatrix;
HashSet<String> topicSet;


DateTime loadDate (String dateStr) {
    String[] components = split(dateStr, "-");
    int newYear = int(components[0]);
    int newMonth = int(components[1]);
    int newDay = int(components[2]);
    return new DateTime(newYear, newMonth, newDay, 0, 0);
}


ArrayList<Episode> loadEpisodes (JSONArray parsedArray) {
    int numEpisodes = parsedArray.size();

    ArrayList<Episode> retList = new ArrayList<Episode>();

    for (int episodeIndex = 0; episodeIndex < numEpisodes; episodeIndex++) {
        JSONObject sourceJSON = parsedArray.getJSONObject(episodeIndex);

        ArrayList<String> newTopicsArray = new ArrayList<String>(Arrays.asList(
            sourceJSON.getJSONArray("tags").getStringArray()
        ));

        retList.add(new Episode(
            sourceJSON.getString("name"),
            loadDate(sourceJSON.getString("date")),
            sourceJSON.getString("loc"),
            sourceJSON.getInt("duration"),
            newTopicsArray,
            sourceJSON.getString("show")
        ));
    }

    return retList;
}


HashMap<String, Topic> loadTopics (JSONArray parsedArray) {
    int numTopics = parsedArray.size();
    HashMap<String, Topic> retTopics = new HashMap<String, Topic>();

    for (int topicIndex = 0; topicIndex < numTopics; topicIndex++) {
        JSONObject sourceJSON = parsedArray.getJSONObject(topicIndex);
        Topic newTopic = new Topic(
            sourceJSON.getString("name"),
            sourceJSON.getInt("num_episodes"),
            sourceJSON.getInt("duration")
        );
        retTopics.put(newTopic.getName(), newTopic);
    }

    return retTopics;
}


HashMap<String, Show> loadShows (JSONArray parsedArray) {
    int numShows = parsedArray.size();
    HashMap<String, Show> retShows = new HashMap<String, Show>();

    for (int showIndex = 0; showIndex < numShows; showIndex++) {
        JSONObject sourceJSON = parsedArray.getJSONObject(showIndex);

        ArrayList<String> newTopicsArray = new ArrayList<String>(Arrays.asList(
            sourceJSON.getJSONArray("tags").getStringArray()
        ));

        Show newShow = new Show(
            sourceJSON.getString("name"),
            newTopicsArray,
            sourceJSON.getInt("episodes"),
            sourceJSON.getInt("duration")
        );
        retShows.put(newShow.getName(), newShow);
    }

    return retShows;
}


void loadDataset() {
    JSONObject datasetSource = loadJSONObject(DATASET_JSON_LOC);

    curDataset = new Dataset(
        loadEpisodes(datasetSource.getJSONArray("episodes")),
        loadTopics(datasetSource.getJSONArray("tags")),
        loadShows(datasetSource.getJSONArray("shows"))
    );

    topicSet = new HashSet<String>();
    curCoocurranceMatrix = new CoocurranceMatrix();
    for (String showName : ORDERED_SHOW_NAMES) {
        for (Episode episode : curDataset.getEpisodes().get(showName)) {
            curCoocurranceMatrix.processEpisode(episode);
            for (String topic : episode.getTopics()) { topicSet.add(topic); }
        }
    }
}
