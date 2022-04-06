package courses;

import javafx.scene.control.RadioButton;

import java.util.*;

public class Lecture implements Course {
    private String className;

    private int idNumber;

    private int sectionNumber;

    private String department;

    private int capacity;

    private String modality;

    private int creditNumber;

    private float teachLoad;

    private List<Object> prerequisites;

    private List<Object> conflicts;

    private boolean hasLab;

    // Simple 3 parameter Lecture Constrcutor for testing purposes
    public Lecture (String className, int sectionNumber, String department) {
        this.className = className;

        this.sectionNumber = sectionNumber;

        this.department = department;
    }

    // Constructor Method
/*    public Lecture (String className, int idNumber, int sectionNumber, String department,
                    int capacity, String modality, int creditNumber, float teachLoad,
                    List<Object> prerequisites, List<Object> conflicts, boolean hasLab) {

        this.className = className;
        this.idNumber = idNumber;
        this.sectionNumber = sectionNumber;
        this.department = department;
        this.capacity = capacity;
        this.modality = modality;
        this.creditNumber = creditNumber;
        this.teachLoad = teachLoad;
        this.prerequisites = prerequisites;
        this.conflicts = conflicts;
        this.hasLab = hasLab;
    }*/

    public boolean hasLab() {
        return this.hasLab;
    }

    public List<Object> availableLabs(List<Object> labs) {
        return labs;
    }

    // Parking Pass??? Would have to discuss with team more about this.

    @Override
    public String getClassName() {
        return this.className;
    }

    @Override
    public void setClassName(String name) {
        this.className = name;
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

    /**
     * This method return the string formatted lecture/course from the given user input
     * @return user input in string
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClassName());
        sb.append(getSectionNumber());
        sb.append(getDepartment());
        String output = sb.toString();
        return output;
    }
}
