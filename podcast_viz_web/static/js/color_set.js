/**
 * Structures and logic for loading and using sets of stateful colors.
 *
 * Structures and logic for loading and reading sets of colors where each
 * set defines how a graphic is displayed based on state and / or component.
 *
 * @author Sam Pottinger
 */


/**
 * Parse a set of colors from raw JSON objects.
 *
 * Parse a set of colors from JSON objects containing the colors for a
 * graphic's halo (data encoding piece), fill (center dot), and hover (when
 * the mouse is upon the halo).
 *
 * @param {Object} target - Parsed JSON object with raw RGBA values.
 * @return {ColorSet} Parsed color set from the provided JSON object.
 */
var loadColorSet = function(target) {
    var halo = target["halo"];
    var hover = target["hover"];
    var fill = target["fill"];
    return new ColorSet(
        color(halo["R"], halo["G"], halo["B"], halo["A"]),
        color(hover["R"], hover["G"], hover["B"], hover["A"]),
        color(fill["R"], fill["G"], fill["B"], fill["A"])
    );
};


/**
 * Load the visualization color sets from the default JSON file.
 *
 * @return {domenic.dict} Dict mapping the name of a color set to the color set.
 *      Will contain all color sets in the defualt JSON file.
 */
var loadColors = function() {
    var newColors = loadJSONObject("show_colors.json");

    ORDERED_SHOW_NAMES.forEach(function (showName) {
        SHOW_COLORS.set(
            showName,
            loadColorSet(newColors[showName])
        );
    });
};


/**
 * Set of colors for different components and states.
 *
 * @param {p5js.color} newHalo - The color for the halo component of the
 *      graphic.
 * @param {p5js.color} newHover - The color for the halo component of the
 *      graphic while the user's cursor is upon the object.
 * @param {p5js.color} newFillColor - The color for the center dot or "fill" of
 *      the object.
 */
function ColorSet (newHalo, newHover, newFillColor) {
    // -- Private vars --
    var halo;
    var hover;
    var fillColor;

    // -- Method declarations --

    /**
     * Get the default color for the halo component of the graphic.
     *
     * @return {p5js.color} The color to use for the halo component of the
     *      graphic by default.
     */
    var getHalo = function() {
        return halo;
    };

    /**
     * Get the color for the halo component while the cursor is upon the object.
     *
     * @return {p5js.color} The color to use for the halo component of the
     *      graphic when the user's cursor is hovering on the object.
     */
    var getHover = function() {
        return hover;
    };

    /**
     * Get the color to use for the center "fill" of the graphic.
     *
     * @return {p5js.color} The color of the dot or "fill" of the graphic.
     */
    var getFill = function() {
        return fillColor;
    };

    // -- Constructor --
    halo = newHalo;
    hover = newHover;
    fillColor = newFillColor;

    // -- Attach public members --
    this.getHalo = getHalo;
    this.getHover = getHover;
    this.getFill = getFill;
}
