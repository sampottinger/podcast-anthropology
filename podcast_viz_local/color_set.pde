ColorSet loadColorSet (JSONObject target) {
    return new ColorSet(
        unhex(target.getString("halo")),
        unhex(target.getString("hover")),
        unhex(target.getString("fill"))
    );
}


void loadColors () {
    JSONObject newColors = loadJSONObject("show_colors.json");

    for (String showName : ORDERED_SHOW_NAMES) {
        SHOW_COLORS.put(
            showName,
            loadColorSet(newColors.getJSONObject(showName))
        );
    }
}


class ColorSet {
    private int halo;
    private int hover;
    private int fillColor;

    ColorSet(int newHalo, int newHover, int newFillColor) {
        halo = newHalo;
        hover = newHover;
        fillColor = newFillColor;
    }

    int getHalo () {
        return halo;
    }

    int getHover () {
        return hover;
    }

    int getFill () {
        return fillColor;
    }
};
