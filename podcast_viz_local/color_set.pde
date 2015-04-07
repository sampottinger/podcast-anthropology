ColorSet loadColorSet (JSONObject target) {
    return new ColorSet(
        unhex(target.getString("halo")),
        unhex(target.getString("hover"))
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

    ColorSet(int newHalo, int newHover) {
        halo = newHalo;
        hover = newHover;
    }

    int getHalo () {
        return halo;
    }

    int getHover () {
        return hover;
    }
};
