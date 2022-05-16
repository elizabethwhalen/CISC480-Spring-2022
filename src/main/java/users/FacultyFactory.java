package users;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class FacultyFactory {

    public FacultyFactory() {}

    public List<Faculty> createFaculty() {
        JSONArray faculty = DatabaseStatic.getData("faculty");
        List<Faculty> professors = new ArrayList<>();
        if (faculty == null) {
            return null;
        }
        for (Object json : faculty) {
            Faculty prof = new Faculty();
            JSONObject professor = (JSONObject) json;
            prof.setFacultyId(professor.getInt("faculty_id"));

            if (professor.getString("faculty_first") != JSONObject.NULL) {
                prof.setFacultyFirst(professor.getString("faculty_first"));
            }

            if (professor.getString("faculty_last") != JSONObject.NULL) {
                prof.setFacultyLast(professor.getString("faculty_last"));
            }

            try {
                prof.setTitleId(professor.getInt("title_id"));
            } catch (JSONException e) {
                //no op
            }

            try {
                prof.setPrevLoad(professor.getDouble("prev_course_load"));
            } catch (JSONException e) {
                //no op
            }

            try {
                prof.setCurrLoad(professor.getDouble("current_course_load"));
            } catch (JSONException e) {
                //no op
            }

            professors.add(prof);
        }

        return professors;
    }
}
