package scheduler;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateTimeUtils {

    /**
     * Converts a character to a dayOfTheWeek object
     * @param day the character to convert
     * @return the day of the week corresponding with the day
     */
    public static DayOfTheWeek convertToDayOFWeek(String day) {
        return switch (day.toUpperCase()) {
            case "M" -> DayOfTheWeek.MONDAY;
            case "T" -> DayOfTheWeek.TUESDAY;
            case "W" -> DayOfTheWeek.WEDNESDAY;
            case "R" -> DayOfTheWeek.THURSDAY;
            case "F" -> DayOfTheWeek.FRIDAY;
            default -> null;
        };
    }

    /**
     * Converts a date to local date time
     * @param dateToConvert the date to be converted
     * @return a date in local date time format
     */
    public static LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
