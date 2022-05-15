package courses;

/**
 * Holds a lecture object and values
 */
public class Lecture {

    /**
     * The dept code for the lecture
     * Ex. CISC
     */
    private String deptCode;

    /**
     * The class num for the lecture
     * Ex. 131
     */
    private String classNum;

    /**
     * The class name for the lecture
     * Ex. Intro to Programming
     */
    private String className;

    /**
     * Section number for the lecture
     */
    private int sectionNum;

    /**
     * The semester for the lecture
     * Currently not implemented we use dummy values to satisfy the database
     */
    private String semester;

    /**
     * The draft of the schedule
     * Current not used, dummy data is used to satisfy the database
     */
    private int draft;

    /**
     * The capacity for the lecture
     */
    private int capacity;

    /**
     * The constructor for the lecture
     */
    public Lecture() {}

    /**
     * The following are all self-explanatory methods that do not require comments to make sense
     * Allowed under Google style guide Section 7.3.1
     */
    public String getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    public String getClassNum() {
        return classNum;
    }

    public void setClassNum(String classNum) {
        this.classNum = classNum;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public int getSectionNum() {
        return sectionNum;
    }

    public void setSectionNum(int sectionNum) {
        this.sectionNum = sectionNum;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public int getDraft() {
        return draft;
    }

    public void setDraft(int draft) {
        this.draft = draft;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public float teachLoad() {
        float teachLoad = 1;
        return teachLoad;
    }

    /**
     * Builds up the important info from the class
     * @return returns the string with the dept code, class num, and class name
     */
    public String toString() {
        return getDeptCode() + " " + getClassNum() + "-" + getSectionNum() + " " + getClassName();
    }
}
