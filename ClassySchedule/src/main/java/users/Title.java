package users;

/**
 * An enum for each type of user
 */
public enum Title {

    ADJUNCT("1"),
    ASSOCIATE("2"),
    CHAIR("3");

    public final String label;

    /**
     * Returns the value of the day
     * @param label the day of the week
     */
    Title(String label) {
        this.label = label;
    }
}
