package courses;

import javafx.scene.control.RadioButton;

/**
 * This class is a workaround class to display the lecture course into the tableview calendar
 */
public class DisplayCourse implements Display {
    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;

    public DisplayCourse () {
        this.monday = "";
        this.tuesday = "";
        this.wednesday = "";
        this.thursday = "";
        this.friday = "";
    }

    public DisplayCourse (String monday, String tuesday, String wednesday, String thursday, String friday) {
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
    }

    @Override
    public void setMonday(String input) {
        this.monday = input;
    }

    @Override
    public String getMonday() {
        return this.monday;
    }

    @Override
    public void setTuesday(String input) {
        this.tuesday = input;
    }

    @Override
    public String getTuesday() {
        return this.tuesday;
    }

    @Override
    public void setWednesday(String input) {
        this.wednesday = input;
    }

    @Override
    public String getWednesday() {
        return this.wednesday;
    }

    @Override
    public void setThursday(String input) {
        this.thursday = input;
    }

    @Override
    public String getThursday() {
        return this.thursday;
    }

    @Override
    public void setFriday(String input) {
        this.friday = input;
    }

    @Override
    public String getFriday() {
        return this.friday;
    }
}
