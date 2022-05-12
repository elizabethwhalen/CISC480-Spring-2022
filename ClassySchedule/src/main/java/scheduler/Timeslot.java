package scheduler;

public class Timeslot {
    String startTime;
    String endTime;
    String daysOfWeek;

    public Timeslot(String daysOfWeek, String startTime, String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.daysOfWeek = daysOfWeek;
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


    @Override
    public String toString() {
        return daysOfWeek + " " +  startTime + "-" + endTime;

    }
}
