class LinearScale {
    private float slope;
    private float startX;

    LinearScale (float minX, float maxX, float minY, float maxY) {
        slope = (maxY - minY) / (maxX - minX);
        startX = minY - slope * minX;
    }

    float scale(float input) {
        return input * slope + startX;
    }

    float invert(float input) {
        return (input - startX) / slope;
    }
};
