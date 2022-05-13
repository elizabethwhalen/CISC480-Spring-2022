package courses;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class CourseFactory {

    public CourseFactory() {

    }

    public List<Course> createCourses() {
        JSONArray classes = DatabaseStatic.getData("class");
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
            //TODO: get section data?
            courses.add(lec);
        }

        return courses;
    }
}
