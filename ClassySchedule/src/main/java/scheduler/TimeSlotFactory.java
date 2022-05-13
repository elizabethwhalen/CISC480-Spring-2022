package scheduler;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class TimeSlotFactory {
    public TimeSlotFactory(){
        //This is the constructor
    }
    public ArrayList<Timeslot> createTimeSlot(){
        ArrayList<Timeslot> timeSlotList = new ArrayList<>();
        //ArrayList<Timeslot> sortedTimeSlot = new ArrayList<>();
        ArrayList<Timeslot> mon = new ArrayList<>();
        ArrayList<Timeslot> tues = new ArrayList<>();
        ArrayList<Timeslot> wed = new ArrayList<>();
        ArrayList<Timeslot> thur = new ArrayList<>();
        ArrayList<Timeslot> fri = new ArrayList<>();
        String start, end, days;
        JSONArray currentTimeChunkJSON = DatabaseStatic.getData("timeslot");
        for (Object jsonObject: currentTimeChunkJSON) {
            JSONObject job = (JSONObject)jsonObject;
            start = job.getString("time_start");
            end = job.getString("time_end");
            days = job.getString("day_of_week");
            int timeID = job.getInt("time_id");
            Timeslot currentTimeSlot = new Timeslot(timeID, days, start, end);
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
}
