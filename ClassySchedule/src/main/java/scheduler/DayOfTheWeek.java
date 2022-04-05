package scheduler;

public enum DayOfTheWeek {
    MONDAY("2022-04-04"),
    TUESDAY("2022-04-05"),
    WEDNESDAY("2022-04-06"),
    THURSDAY("2022-04-07"),
    FRIDAY("2022-04-08");

    public final String label;

    private DayOfTheWeek(String label) {
        this.label = label;
    }
}
