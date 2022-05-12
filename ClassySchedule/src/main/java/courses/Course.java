package courses;

/**
 * This interface contains the necessary getter and setter methods
 * for courses. It is implemented by both the Lecture class
 */
public interface Course {

    String getClassName();

    void setClassName(String name);

    int getSectionNum();

    void setSectionNum(int number);

    String getDeptCode();

    void setDeptCode(String deptCode);

    int getCapacity();

    void setCapacity(int capacity);

    String getSemester();

    void setSemester(String semester);

    float teachLoad();

    int getDraft();

    void setDraft(int draft);

    String getClassNum();

    void setClassNum(String classNum);


}
