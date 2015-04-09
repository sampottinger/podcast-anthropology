class AggregationBarChartProto {
    private boolean aggSet;
    private HashMap<String, Aggregator> groups;
    private int bucketGranularity;
    private float midVal;
    private boolean usePercent;

    private boolean yCoordSet;
    private float startY;

    private boolean xCoordSet;
    private float startScaleX;
    private float endScaleX;

    private boolean textSet;
    private String baselineText;
    private String midValText;
    private String titleText;

    AggregationBarChartProto () {
        aggSet = false;
        yCoordSet = false;
        xCoordSet = false;
        textSet = false;
    }

    void setAggSettings (HashMap<String, Aggregator> newGroups,
        int newBucketGranularity, float newMidVal, boolean newUsePercent) {

        groups = newGroups;
        bucketGranularity = newBucketGranularity;
        midVal = newMidVal;
        usePercent = newUsePercent;
        aggSet = true;
    }

    void setYCoord (float newStartY) {
        startY = newStartY;
        yCoordSet = true;
    }

    void setXCoord (float newStartX, float newEndX) {
        startScaleX = newStartX;
        endScaleX = newEndX;
        xCoordSet = true;
    }

    void setText (String newBaseline, String newMidVal, String newTitle) {
        baselineText = newBaseline;
        midValText = newMidVal;
        titleText = newTitle;
        textSet = true;
    }

    HashMap<String, Aggregator> getGroups () {
        if (!aggSet) {
            throw new RuntimeException("Aggregation settings not provided.");
        }
        return groups;
    }

    int getBucketGranularity () {
        if (!aggSet) {
            throw new RuntimeException("Aggregation settings not provided.");
        }
        return bucketGranularity;
    }

    float getMidVal () {
        if (!aggSet) {
            throw new RuntimeException("Aggregation settings not provided.");
        }
        return midVal;
    }

    boolean getUsePercent () {
        if (!aggSet) {
            throw new RuntimeException("Aggregation settings not provided.");
        }
        return usePercent;
    }

    float getStartY () {
        if (!yCoordSet) {
            throw new RuntimeException("Y coordinates not provided.");
        }
        return startY;
    }

    float getStartScaleX () {
        if (!xCoordSet) {
            throw new RuntimeException("X coordinates not provided.");
        }
        return startScaleX;
    }

    float getEndScaleX () {
        if (!xCoordSet) {
            throw new RuntimeException("X coordinates not provided.");
        }
        return endScaleX;
    }

    String getBaselineText () {
        if (!textSet) {
            throw new RuntimeException("Text not provided.");
        }
        return baselineText;
    }

    String getMidValText () {
        if (!textSet) {
            throw new RuntimeException("Text not provided.");
        }
        return midValText;
    }

    String getTitleText () {
        if (!textSet) {
            throw new RuntimeException("Text not provided.");
        }
        return titleText;
    }

};


class AggregationBarChart implements GraphicEntity {
    private HashMap<String, Aggregator> groups;
    private float startY;
    private float startScaleX;
    private float endScaleX;
    private int bucketGranularity;
    private String baselineText;
    private float midVal;
    private String midValText;
    private String titleText;
    private boolean usePercent;
    private ArrayList<GraphicEntity> childrenEntities;
    
    private float endYCoord;

    AggregationBarChart (AggregationBarChartProto proto) {
        groups = proto.getGroups();
        bucketGranularity = proto.getBucketGranularity();
        midVal = proto.getMidVal();
        usePercent = proto.getUsePercent();
        startY = proto.getStartY();
        startScaleX = proto.getStartScaleX();
        endScaleX = proto.getEndScaleX();
        baselineText = proto.getBaselineText();
        midValText = proto.getMidValText();
        titleText = proto.getTitleText();

        childrenEntities = new ArrayList<GraphicEntity>();

        createElements();
    }

    void draw () {
        for (GraphicEntity e : childrenEntities) { e.draw(); }
    }

    void update () {
        for (GraphicEntity e : childrenEntities) { e.update(); }
    }

    void onPress () {
        for (GraphicEntity e : childrenEntities) { e.onPress(); }
    }

    void onRelease () {
        for (GraphicEntity e : childrenEntities) { e.onRelease(); }
    }
    
    private void createElements () {
        int i;
    
        float bodyStartY = startY + 18;

        // Build scales
        int maxKey = 0;
        int maxBucketSize = 0;
        for (Aggregator agg : groups.values()) {
            int aggMax = agg.getMaxBucket();
            int sizeMax = agg.getMaxBucketSize();
            maxKey = maxKey > aggMax ? maxKey : aggMax;
            maxBucketSize = maxBucketSize > sizeMax ? maxBucketSize : sizeMax;
        }

        LinearScale xScale = new LinearScale(0, maxKey, startScaleX, endScaleX);
        LinearScale yScale = new LinearScale(
            usePercent ? 1 : 0,
            usePercent ? 100 : maxBucketSize,
            -1,
            -30
        );

        float barWidth = xScale.scale(bucketGranularity) - xScale.scale(0);

        // Create bars
        i = 1;
        for (String showName : ORDERED_SHOW_NAMES) {
            float y = 30 * i + bodyStartY;
            float numEpisdes = curDataset.getEpisodes().get(showName).size();

            childrenEntities.add(new YMarker(
                startScaleX,
                y,
                endScaleX - startScaleX + 10,
                baselineText
            ));

            childrenEntities.add(new YMarker(
                endScaleX + 10,
                y + yScale.scale(midVal),
                3,
                midValText
            ));

            HashMap<Integer, Integer> counts = groups.get(
                showName).getBuckets();

            for (Integer diff : counts.keySet()) {
                float x = xScale.scale(diff);
                
                float barVal;
                if (usePercent) {
                    barVal = (counts.get(diff) / numEpisdes) * 100;
                } else {
                    barVal = counts.get(diff);
                }
                float barHeight = yScale.scale(barVal);
                
                childrenEntities.add(
                    new StaticRect(x, y, barWidth - 1, barHeight, MID_GREY)
                );
            }

            i++;
        }

        // Create title
        childrenEntities.add(new Title(
            5,
            startY - 18,
            WIDTH,
            titleText
        ));

        // Create axes
        childrenEntities.add(new NumberAxis(
            TIMELINE_GROUP_START_X + 20,
            bodyStartY - 20,
            endScaleX - startScaleX + barWidth,
            xScale,
            0,
            maxKey,
            50
        ));

        endYCoord = 30 * (i + 1) + bodyStartY;
    }

    float getEndY() {
        return endYCoord;
    }
};
