package scheduler;

/**
 * An enum for each day of the week
 * The calendar relies on each day being one
 * specific week to display the correct appointments
 */
public enum DayOfTheWeek {

    MONDAY("2022-04-04"),
    TUESDAY("2022-04-05"),
    WEDNESDAY("2022-04-06"),
    THURSDAY("2022-04-07"),
    FRIDAY("2022-04-08");


    public final String label;

    /**
     * Returns the value of the day
     * @param label the day of the week
     */
    DayOfTheWeek(String label) {
        this.label = label;
    }
}
