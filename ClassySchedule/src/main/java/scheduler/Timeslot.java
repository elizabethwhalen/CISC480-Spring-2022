package scheduler;

public class Timeslot {
    String startTime;
    String endTime;
    String daysOfWeek;
    int timeId;

    public Timeslot(int timeId, String daysOfWeek, String startTime, String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.daysOfWeek = daysOfWeek;
        this.timeId = timeId;
    }
    public void setStartTime(String startTime){
        this.startTime = startTime;
    }
    public void setEndTime(String endTime){
        this.endTime = endTime;
    }
    public void setDaysOfWeek(String daysOfWeek){
        this.daysOfWeek = daysOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getDaysOfWeek() {
        return daysOfWeek;
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
