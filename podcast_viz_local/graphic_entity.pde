interface GraphicEntity {
    void draw ();
    void update (int localMouseX, int localMouseY);
    void onPress (int localMouseX, int localMouseY);
    void onRelease (int localMouseX, int localMouseY);
}


interface IdlingStrategy {
    void update (EpisodeGraphic target);
}
