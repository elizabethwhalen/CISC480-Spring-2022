package src.sample;


/*

Questions that came up while coding this:
Does this class know what each classroom has or does somewhere else know?
If this class is supposed to know, how do we find this information?
How do we also store all this info?

 */

import java.util.*;

public class room { //Either this class knows all the features a certain room has or this class gets that information from another class.
    private int roomNum;
    private String buildingName;
    private String campus;
    private int capacity;
    private List<String> features;

    //Constructor method if need be
    public room(int roomNumber, String building, String campus, int roomCapacity, List<String> features){
        this.roomNum = roomNumber;
        this.buildingName = building;
        this.campus = campus;
        this.capacity = roomCapacity;
        this.features = features;
    }

    // Will brainstorm more of this over the weekend
    public String getBuildingName(){
        return this.buildingName;
    }


    //If this class knows the data already...
    public void whichFeatures(){
        // HashMap room number with features?
    }


}
