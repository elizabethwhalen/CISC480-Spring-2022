package scheduler;

/**
 * Represents a time slot
 */
public class Timeslot {
    /**
     * The start time of the timeslot
     */
    private String startTime;

    /**
     * The end time of the timeslot
     */
    private String endTime;

    /**
     * The days of the week of the timeslot
     */
    private String daysOfWeek;

    /**
     * The unique timeslot id
     */
    private int timeId;

    /**
     * Constructs a timeslot
     * @param timeId the time ID
     * @param daysOfWeek the days of the week for the timeslot
     * @param startTime the start time for the timeslot
     * @param endTime the end time for the timeslot
     */
    public Timeslot(int timeId, String daysOfWeek, String startTime, String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.daysOfWeek = daysOfWeek;
        this.timeId = timeId;
    }

    /**
     * The methods below are all basic getter/setter methods that do not need
     * explanation. Allowed by the Google Style Guide Section 7.3.1
     */
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime){
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime){
        this.endTime = endTime;
    }

    public String getDaysOfWeek() {
        return daysOfWeek;
    }

    public void setDaysOfWeek(String daysOfWeek){
        this.daysOfWeek = daysOfWeek;
    }

    public int getTimeId(){
        return this.timeId;
    }

    public void setTimeId(int timeId) {
        this.timeId = timeId;
    }


    /**
     * The string to construct
     * @return the string with the days of the week, the start time, and the end time
     */
    public String toString() {
        return daysOfWeek + " " +  startTime + "-" + endTime;
    }
}
