/**
 * Collection of logic and structures for scales.
 *
 * Collection of logic and structures to provide d3.scale-like functionality
 * in p5js where a scale maps between two different ranges of numbers.
 *
 * @author Sam Pottinger
 * @license MIT License
 */

/**
 * Create a scale that maps linearly between two ranges of numbers.
 *
 * Object encapsulating a simple linear function (in the mathematical sense of
 * the word), transforming numbers from one set of numbers to another using
 * simple linear scaling.
 *
 * Put another way, object encapuslating the equation of a line where the
 * a line is drawn between the min and max of the "domain" or "x" values on
 * the horizontal axis and the min and max of the "range" or "y" values on
 * the vertical axis. This can, thus, provide the y coordinates for the line
 * given an x value or the x value given the y value of a point on the line.
 *
 * @constructor
 * @param {Number} minX - The minimum value of the function domain.
 * @param {Number} maxX - The maximum value of the function domain.
 * @param {Number} minY - The maximum value of the function range.
 * @param {Number} minY - The maximum value of the function range.
 */
function LinearScale(minX, maxX, minY, maxY) {
    // -- Private vars --
    var slope;
    var startX;

    // -- Method declarations --

    /**
     * Scale a number from the domain into the range.
     *
     * Given an "x" or "input" value, find the corresponding "y" or "output"
     * value using a linear scaling between the "x" or "input" domain and "y"
     * or "ouput" range.
     *
     * @param {Number} input - The x or "input" value to scale.
     * @return {Number} The corresponding "y" value on the line or, in other
     *      words, the "input" domain value mapped to the "output" range.
     */
    var scale = function(input) {
        return input * slope + startX;
    };

    /**
     * Scale a number from the range into the domain.
     *
     * Given a "y" or "output" value, find the corresponding "x" or "input"
     * value using a linear scaling between the "y" or "output" domain and "x"
     * or "input" domain
     *
     * @param {Number} input - The y or "output" value to scale.
     * @return {Number} The corresponding "x" value on the line or, in other
     *      words, the "output" range value mapped to the "input" domain.
     */
    var invert = function(input) {
        return (input - startX) / slope;
    };

    // -- Constructor --
    slope = (maxY - minY) / (maxX - minX);
    startX = minY - slope * minX;

    // -- Attach public members --
    this.scale = scale;
    this.invert = invert;
}
