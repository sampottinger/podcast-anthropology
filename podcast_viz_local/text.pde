String[] getTextLines (String targetKey) {
    return split(TEXT_CONSTANTS.getString(targetKey), "\n");
}