function LinearScale (minX, maxX, minY, maxY) {
    // Private vars
    var slope;
    var startX;

    // Method declarations
    var scale = function (input) {
        return input * slope + startX;
    };

    var invert = function (input) {
        return (input - startX) / slope;
    };

    // Init
    slope = (maxY - minY) / (maxX - minX);
    startX = minY - slope * minX;

    // Attach public members
    this.scale = scale;
    this.invert = invert;
}
