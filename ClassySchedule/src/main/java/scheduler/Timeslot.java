package scheduler;

public class Timeslot {
    private String startTime;
    private String endTime;
    private String daysOfWeek;
    private int timeId;

    public Timeslot(int timeId, String daysOfWeek, String startTime, String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.daysOfWeek = daysOfWeek;
        this.timeId = timeId;
    }

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

    public int getTimeID(){
        return this.timeId;
    }

    public void setTimeId(int timeID) {
        this.timeId = timeID;
    }

    @Override
    public String toString() {
        return daysOfWeek + " " +  startTime + "-" + endTime;

    }
}
