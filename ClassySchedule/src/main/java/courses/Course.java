package courses;

import java.util.*;

/**
 * This interface contains the necessary getter and setter methods
 * for courses and labs. It is implemented by both the Lecture and Lab
 * classes.
 */
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

    String getModality();

    void setModality(String modality);

    int creditNumber();

    void setCreditNumber(int creditNumber);

    float teachLoad();

    void setTeachLoad(float amount);

    List<Object> getPrerequisite();

    void setPrerequisite(List<Object> classes);

    List<Object> getConflicts();

    void setConflicts(List<Object> classes);

}
