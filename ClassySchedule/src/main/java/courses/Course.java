package courses;
import java.util.*;

public interface Course {
    String getClassName();
    void setClassName(String name);

    int getIDNumber();
    void setIDNumber(int number);

    int getSectionNumber();
    void setSectionNumber(int number);

    String getDepartment();
    void setDepartment(String department);

    int getCapacity();
    void setCapacity(int capacity);

    //registered??

    // This refers to whether the class is online/hybrid/in-person
    String getModality();
    void setModality(String modality);

    int creditNumber();
    void setCreditNumber(int creditNumber);

    float teachLoad();
    void setTeachLoad(float amount);

    // I'm not sure about the "main.java.sample.classes" type yet, so I just put in "Object" in for now.
    List<Object> getPrerequisite();
    void setPrerequisite(List<Object> classes);

    List<Object> getConflicts();
    void setConflicts(List<Object> classes);
}
