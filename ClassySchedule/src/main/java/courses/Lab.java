package courses;

import java.util.*;

public class Lab implements Course {
    private String labName;
    private int idNumber;
    private int sectionNumber;
    private String department;
    private int capacity;
    private String modality;
    private int creditNumber;
    private float teachLoad;
    private List<Object> prerequisites;
    private List<Object> conflicts;

    public Lab(String labName, int idNumber, int sectionNumber, String department,
                           int capacity, String modality, int creditNumber, float teachLoad,
                           List<Object> prerequisites, List<Object> conflicts) {
        this.labName = labName;
        this.idNumber = idNumber;
        this.sectionNumber = sectionNumber;
        this.department = department;
        this.capacity = capacity;
        this.modality = modality;
        this.creditNumber = creditNumber;
        this.teachLoad = teachLoad;
        this.prerequisites = prerequisites;
        this.conflicts = conflicts;
    }

    @Override
    public String getClassName() {
        return this.labName;
    }

    @Override
    public void setClassName(String name) {
        this.labName = name;
    }

    @Override
    public int getIDNumber() {
        return this.idNumber;
    }

    @Override
    public void setIDNumber(int number) {
        this.idNumber = number;
    }

    @Override
    public int getSectionNumber() {
        return this.sectionNumber;
    }

    @Override
    public void setSectionNumber(int number) {
        this.sectionNumber = number;
    }

    @Override
    public String getDepartment() {
        return this.department;
    }

    @Override
    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public int getCapacity() {
        return this.capacity;
    }

    @Override
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public String getModality() {
        return this.modality;
    }

    @Override
    public void setModality(String modality) {
        this.modality = modality;
    }

    @Override
    public int creditNumber() {
        return this.creditNumber;
    }

    @Override
    public void setCreditNumber(int creditNumber) {
        this.creditNumber = creditNumber;
    }

    @Override
    public float teachLoad() {
        return this.teachLoad;
    }

    @Override
    public void setTeachLoad(float amount) {
        this.teachLoad = amount;
    }

    @Override
    public List<Object> getPrerequisite() {
        return this.prerequisites;
    }

    @Override
    public void setPrerequisite(List<Object> classes) {
        this.prerequisites = classes;
    }

    @Override
    public List<Object> getConflicts() {
        return this.conflicts;
    }

    @Override
    public void setConflicts(List<Object> classes) {
        this.conflicts = classes;
    }
}
