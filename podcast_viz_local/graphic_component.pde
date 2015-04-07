interface GraphicEntity {
    void draw ();
    void update ();
    void onPress ();
    void onRelease ();
}


interface IdlingStrategy {
    void update (EpisodeGraphic target);
}
