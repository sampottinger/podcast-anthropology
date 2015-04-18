/**
 * Logic and structures to manage the retreival of long string constants.
 *
 * Some messages and long string constants are loaded from data files and this
 * module provides access to those constants.
 *
 * @author Sam Pottinger
 * @license MIT License
 */

/**
 * Get a long text string constant.
 *
 * @param {String} targetKey - The name of the string constant to retrieve.
 * @return {Array<String>} targetKey - The lines of the requested string where
 *      each array element is a new line.
 */
var getTextLines = function(targetKey) {
    return TEXT_CONSTANTS[targetKey].split("\n");
};