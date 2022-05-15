package courses;

public class Lecture implements Course {
    private String deptCode;
    private String classNum;
    private String className;
    private int sectionNum;
    private String semester;
    private int draft;
    private int capacity;

    public Lecture() {}
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

    public String toString() {
        return getDeptCode() + " " + getClassNum() + "-" + getSectionNum() + " " + getClassName();
    }
}
