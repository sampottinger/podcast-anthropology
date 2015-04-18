/**
 * Convienence functions for the visualization.
 *
 * @author Sam Pottinger
 * @license MIT License
 */


/**
 * Find the number of days between two dates.
 *
 * @param {Moment} moment1 - The first date in the range.
 * @param {Moment} moment2 - The second date in the range.
 * @return {Number} Number of days between moment1 and moment2 irrespective
 *      of which date came first.
 */
var daysBetween = function (moment1, moment2) {
    return moment2.diff(moment1, "days");
};


/**
 * Sort an array of objects with a compareTo method.
 *
 * @param {Array<Object>} objs - The array to sort.
 */
var sortObjArray = function (objs) {
    objs.sort(function (a, b) { return a.compareTo(b); });
};


/**
 * Get the contents of a pre-loaded JSON file.
 *
 * @param {String} fileName - The URL / path to the file whose contents should
 *      be returned.
 * @return {Object} The parsed JSON file if exists or undefined otherwise.
 */
var loadJSONObject = function (fileName) {
    return dataSources[fileName];
};


/**
 * Convert a value to a string.
 *
 * @param {*} target - The value to convert.
 * @return {String} String representation of target.
 */
var str = function (target) {
    return String(target);
};


/**
 * Asychronously report usage of a visualization component within telemetry.
 *
 * @param {String} action - The name of the action taken by the user.
 */
var reportUsage = function (action) {
    $.ajax({
        type: "POST",
        url: "/usage",
        data: {"action": action}
    })
};
