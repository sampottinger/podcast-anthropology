import org.joda.time.DateTime;
import java.util.Collections;


class Episode implements Comparable<Episode> {
    private String name;
    private DateTime pubDate;
    private String location;
    private int dur;
    private ArrayList<String> topics;
    private String show;

    Episode (String newName, DateTime newPubDate, String newLocation,
        int newDur, ArrayList<String> newTopics, String newShow) {

        name = newName;
        pubDate = newPubDate;
        location = newLocation;
        dur = newDur;
        topics = newTopics;
        show = newShow;
    }

    String getName () {
        return name;
    }

    DateTime getPubDate () {
        return pubDate;
    }

    String getLocation () {
        return location;
    }

    int getDur () {
        return dur;
    }

    ArrayList<String> getTopics () {
        return topics;
    }

    String getShow () {
        return show;
    }

    int compareTo(Episode other) {
        return getPubDate().compareTo(other.getPubDate());
    }
};


class Topic {
    private String name;
    private int numEpisodes;
    private int dur;

    Topic(String newName, int newNumEpisodes, int newDur) {
        name = newName;
        numEpisodes = newNumEpisodes;
        dur = newDur;
    }

    String getName () {
        return name;
    }

    int getNumEpisodes () {
        return numEpisodes;
    }

    int getDur () {
        return dur;
    }
};


class Show {
    private String name;
    private ArrayList<String> topics;
    private int numEpisodes;
    private int dur;

    Show(String newName, ArrayList<String> newTopics, int newNumEpisodes,
        int newDur) {

        name = newName;
        topics = newTopics;
        numEpisodes = newNumEpisodes;
        dur = newDur;
    }

    String getName () {
        return name;
    }

    ArrayList<String> getTopics () {
        return topics;
    }

    int getEpisodes () {
        return numEpisodes;
    }

    int getDur () {
        return dur;
    }
};


class Dataset {
    private HashMap<String, ArrayList<Episode>> episodes;
    private HashMap<String, Topic> topics;
    private HashMap<String, Show> shows;

    Dataset (ArrayList<Episode> newEpisodes, HashMap<String, Topic> newTopics,
        HashMap<String, Show> newShows) {

        episodes = new HashMap<String, ArrayList<Episode>>();
        episodes.put("This American Life", new ArrayList<Episode>());
        episodes.put("Hello Internet", new ArrayList<Episode>());
        episodes.put("99% Invisible", new ArrayList<Episode>());
        episodes.put("The Memory Palace", new ArrayList<Episode>());
        episodes.put("Radiolab", new ArrayList<Episode>());
        
        for (Episode newEpisode : newEpisodes) {
            episodes.get(newEpisode.getShow()).add(newEpisode);
        }

        for (String showName : episodes.keySet()) {
            Collections.sort(episodes.get(showName));
        }

        topics = newTopics;
        shows = newShows;
    }

    HashMap<String, ArrayList<Episode>> getEpisodes () {
        return episodes;
    }

    HashMap<String, Topic> getTopics () {
        return topics;
    }

    HashMap<String, Show> getShows () {
        return shows;
    }
};
