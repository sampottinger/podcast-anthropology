class CoocurranceMatrix {
    private HashMap<String, Integer> counts;

    CoocurranceMatrix () {
        counts = new HashMap<String, Integer>();
    }

    void processEpisode (Episode episode) {
        for (String topic1 : episode.getTopics()) {
            for (String topic2 : episode.getTopics()) {
                String pairKey = createPairKey(topic1, topic2);
                
                if (!counts.containsKey(pairKey)) {
                    counts.put(pairKey, 0);
                }

                counts.put(pairKey, counts.get(pairKey) + 1);
            }
        }
    }

    int getCount (String topic1, String topic2) {
        String pairKey = createPairKey(topic1, topic2);
        if (counts.containsKey(pairKey)) {
            return counts.get(pairKey);
        } else {
            return 0;
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
