var loadColorSet = function (target) {
    var halo = target["halo"];
    var hover = target["hover"];
    var fill = target["fill"];
    return new ColorSet(
        color(halo["R"], halo["G"], halo["B"], halo["A"]),
        color(hover["R"], hover["G"], hover["B"], hover["A"]),
        color(fill["R"], fill["G"], fill["B"], fill["A"])
    );
};


var loadColors = function () {
    var newColors = loadJSONObject("show_colors.json");

    ORDERED_SHOW_NAMES.forEach(function (showName) {
        SHOW_COLORS.set(
            showName,
            loadColorSet(newColors[showName])
        );
    });
};


function ColorSet (newHalo, newHover, newFillColor) {
    // Private vars
    var halo;
    var hover;
    var fillColor;

    // Method declarations
    var getHalo = function () {
        return halo;
    };

    var getHover = function () {
        return hover;
    };

    var getFill = function () {
        return fillColor;
    };

    // Init
    halo = newHalo;
    hover = newHover;
    fillColor = newFillColor;

    // Attach public members
    this.getHalo = getHalo;
    this.getHover = getHover;
    this.getFill = getFill;
}
