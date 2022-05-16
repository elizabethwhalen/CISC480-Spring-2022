package scheduler;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * A class for commonly used Date/Time utilities
 */
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

    /**
     * This method creates a 2D list of starts and end dates. The first
     * entry in the list is the start date/time, the second is the end date/time
     * @param timeslot the timeslot to parse
     * @return returns a list of lists holding start and end times
     */
    public static List<List<LocalDateTime>> createDateTimes(Timeslot timeslot) {
        List<List<LocalDateTime>> dates = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (String day : timeslot.getDaysOfWeek().split("")) {
            List<LocalDateTime> startAndEndDates = new ArrayList<>();
            try {
                startAndEndDates.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getStartTime())));
                startAndEndDates.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getEndTime())));
            } catch (ParseException e) {
                //should not happen
            }
            dates.add(startAndEndDates);
        }
        return dates;
    }
}
