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
     * Returns the title code of the inputted title name
     * @param label the title name to be converted
     */
    Title(String label) {
        this.label = label;
    }

    /**
     * Returns the title name of the inputted title code
     * @param label the title code to be converted
     * @return
     */
    public static Title valueOfLabel(String label) {
        for (Title e : values()) {
            if (e.label.equals(label)) {
                return e;
            }
        }
        return null;
    }
}
