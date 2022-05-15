package courses;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class CourseFactory {

    public CourseFactory() {}

    public List<Course> createCourses() {
        JSONArray classes = DatabaseStatic.sectionQuery();
        List<Course> courses = new ArrayList<>();

        for (Object json : classes) {
            Lecture lec = new Lecture();
            JSONObject course = (JSONObject) json;
            lec.setDeptCode(course.getString("dept_code"));
            lec.setClassNum(course.getString("class_num"));

            if (course.getString("class_name") != JSONObject.NULL) {
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
                //no-op
            }
            courses.add(lec);
        }

        return courses;
    }
}
