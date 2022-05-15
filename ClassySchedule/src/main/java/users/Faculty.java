package users;

public class Faculty {
    private int facultyID;
    private String facultyFirst;
    private String facultyLast;
    private int titleID;
    private double prev_load;
    private double currLoad;

    public Faculty() {}

    public int getFacultyID() {
        return facultyID;
    }

    public void setFacultyID(int facultyID) {
        this.facultyID = facultyID;
    }

    public String getFacultyFirst() {
        return facultyFirst;
    }

    public void setFacultyFirst(String facultyFirst) {
        this.facultyFirst = facultyFirst;
    }

    public String getFacultyLast() {
        return facultyLast;
    }

    public void setFacultyLast(String facultyLast) {
        this.facultyLast = facultyLast;
    }

    public int getTitleID() {
        return titleID;
    }

    public void setTitleID(int titleID) {
        this.titleID = titleID;
    }

    public double getPrev_load() {
        return prev_load;
    }

    public void setPrev_load(double prev_load) {
        this.prev_load = prev_load;
    }

    public double getCurrLoad() {
        return currLoad;
    }

    public void setCurrLoad(double currLoad) {
        this.currLoad = currLoad;
    }

    public String toString() {
        return getFacultyFirst() + " " + getFacultyLast() + " " + getFacultyID();
    }
}
