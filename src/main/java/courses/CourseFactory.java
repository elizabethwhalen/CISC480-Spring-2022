package courses;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * This creates the course objects using the info from the database
 */
public class CourseFactory {

    /**
     * Constructs a course factory
     */
    public CourseFactory() {}

    /**
     * Creates the lecture objects
     * Calls the database and then parse the data to create the lecture objects
     * @return returns a list of lecture objects
     */
    public List<Lecture> createCourses() {
        JSONArray classes = DatabaseStatic.sectionQuery();
        List<Lecture> courses = new ArrayList<>();
        if (classes == null) {
            return null;
        }
        for (Object json : classes) {
            Lecture lec = new Lecture();
            JSONObject course = (JSONObject) json;
            lec.setDeptCode(course.getString("dept_code"));
            lec.setClassNum(course.getString("class_num"));

            if (course.get("class_name") != JSONObject.NULL) {
                lec.setClassName(course.getString("class_name"));
            } else {
                lec.setClassNum("TBD");
            }
            lec.setSectionNum(course.getInt("section_num"));
            lec.setSemester(course.getString("semester"));
            lec.setDraft(course.getInt("draft"));

            try {
                lec.setCapacity(course.getInt("capacity"));
            } catch (JSONException e) {
                // capacity is not present, do not update the lecture object
            }
            courses.add(lec);
        }

        return courses;
    }
}
