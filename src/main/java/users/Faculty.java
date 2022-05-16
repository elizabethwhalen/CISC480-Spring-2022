package users;

/**
 * Represents a faculty member
 */
public class Faculty {
    /**
     * The faculty ID
     */
    private int facultyId;

    /**
     * The first name of the faculty
     */
    private String facultyFirst;

    /**
     * The last name of the faculty
     */
    private String facultyLast;

    /**
     * The title of the faculty
     */
    private int titleId;

    /**
     * The previous teach load of the faculty
     */
    private double prevLoad;

    /**
     * The current teach load of the professor
     */
    private double currLoad;

    /**
     * The constructor for a faculty member
     */
    public Faculty() {}

    /**
     * All the following methods are standard getters/setters
     * As such they do not have comments explaining their use.
     * This is in line with the Google Java Style Guide Section 7.3.1
     */

    public int getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(int facultyId) {
        this.facultyId = facultyId;
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

    public int getTitleId() {
        return titleId;
    }

    public void setTitleId(int titleId) {
        this.titleId = titleId;
    }

    public double getPrevLoad() {
        return prevLoad;
    }

    public void setPrevLoad(double prevLoad) {
        this.prevLoad = prevLoad;
    }

    public double getCurrLoad() {
        return currLoad;
    }

    public void setCurrLoad(double currLoad) {
        this.currLoad = currLoad;
    }

    /**
     * Builds a string representation of the faculty
     * @return the string with the faculty first and last name and the faculty ID
     */
    public String toString() {
        return getFacultyFirst() + " " + getFacultyLast() + " " + getFacultyId();
    }
}
