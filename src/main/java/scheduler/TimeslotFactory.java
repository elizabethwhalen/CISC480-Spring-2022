package scheduler;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

/**
 * This factory creates the time slots from the timeslots saved in the database
 */
public class TimeslotFactory {

    /**
     * The constructor for the timeslot factory
     */
    public TimeslotFactory(){}

    /**
     * Constructs the timeslots from the stored timeslots in the database
     * Sorts them by day
     * @return returns a list of the stored timeslots from the database
     */
    public List<Timeslot> createTimeSlot(){
        ArrayList<Timeslot> timeSlotList = new ArrayList<>();
        ArrayList<Timeslot> mon = new ArrayList<>();
        ArrayList<Timeslot> tues = new ArrayList<>();
        ArrayList<Timeslot> wed = new ArrayList<>();
        ArrayList<Timeslot> thur = new ArrayList<>();
        ArrayList<Timeslot> fri = new ArrayList<>();

        JSONArray currentTimeChunkJSON = DatabaseStatic.getData("timeslot");
        if (currentTimeChunkJSON == null) {
            return null;
        }
        for (Object jsonObject: currentTimeChunkJSON) {
            JSONObject job = (JSONObject)jsonObject;
            String start = job.getString("time_start");
            String end = job.getString("time_end");
            String days = job.getString("day_of_week");
            int timeId = job.getInt("time_id");
            Timeslot currentTimeSlot = new Timeslot(timeId, days, start, end);
            timeSlotList.add(currentTimeSlot);
        }
        //sorts by day
        for (Timeslot currentTimeChunk : timeSlotList) {
            String day = currentTimeChunk.getDaysOfWeek();
            if (day.charAt(0) == 'M') {
                mon.add(currentTimeChunk);
            } else if (day.charAt(0) == 'T') {
                tues.add(currentTimeChunk);
            } else if (day.charAt(0) == 'W') {
                wed.add(currentTimeChunk);
            } else if (day.charAt(0) == 'R') {
                thur.add(currentTimeChunk);
            } else {//if(day.charAt(0) == 'F'){
                //System.out.println(currentTimeChunk);
                fri.add(currentTimeChunk);
            }
        }
        timeSlotList = new ArrayList<>();
        timeSlotList.addAll(mon);
        timeSlotList.addAll(tues);
        timeSlotList.addAll(wed);
        timeSlotList.addAll(thur);
        timeSlotList.addAll(fri);
        return timeSlotList;
    }

    /**
     * Takes in a timeslot and finds the corresponding time ID
     * @param startTime the start time of the timeslot
     * @param endTime the end time of the timeslot
     * @param daysOfWeek the days of week of the timeslot
     * @param times the list of timeslots to check
     * @return the time ID of the timeslot or -1 if not found.
     */
    public int findTimeSlot(String startTime, String endTime, String daysOfWeek, List<Timeslot> times) {
        for (Timeslot current : times) {
            if (current.getEndTime().equals(endTime) && current.getStartTime().equals(startTime) && current.getDaysOfWeek().equals(daysOfWeek)) {
                return current.getTimeId();
            }
        }
        return -1;
    }
}
