class CoocurranceMatrix {
    private HashMap<String, ArrayList<EpisodeGraphic>> counts;

    CoocurranceMatrix () {
        counts = new HashMap<String, ArrayList<EpisodeGraphic>>();
    }

    float getGini (String topic1, String topic2) {
        float sum1 = getPairSize(topic1, topic1);
        float sum2 = getPairSize(topic2, topic2);
        float overlap = getPairSize(topic1, topic2);
        return sum1 == 0 || sum2 == 0 ? 0 : overlap / (sum1 + sum2);
    }

    void processEpisode (EpisodeGraphic episodeGraphic) {
        for (String topic1 : episodeGraphic.getEpisode().getTopics()) {
            for (String topic2 : episodeGraphic.getEpisode().getTopics()) {
                if (topic1.compareTo(topic2) <= 0) {
                    String pairKey = createPairKey(topic1, topic2);  
                    
                    if (!counts.containsKey(pairKey)) {
                        counts.put(pairKey, new ArrayList<EpisodeGraphic>());
                    }

                    counts.get(pairKey).add(episodeGraphic);
                }
            }
        }
    }

    int getPairSize (String topic1, String topic2) {
        ArrayList<EpisodeGraphic> episodes = getPair(topic1, topic2);
        return episodes == null ? 0 : episodes.size();
    }

    ArrayList<EpisodeGraphic> getPair (String topic1, String topic2) {
        String pairKey = createPairKey(topic1, topic2);
        if (counts.containsKey(pairKey)) {
            return counts.get(pairKey);
        } else {
            return null;
        }
    }

    private String createPairKey (String topic1, String topic2) {
        if (topic1.compareTo(topic2) < 0) {
            return topic1 + " " + topic2;
        } else {
            return topic2 + " " + topic1;
        }
    }
};
