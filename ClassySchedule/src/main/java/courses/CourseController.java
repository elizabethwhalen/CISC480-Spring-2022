package courses;

import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.util.ResourceBundle;

public class CourseController implements Initializable {
    private Stage addCourse;
    @FXML
    TextField section_number;

    @FXML
    TextField class_name;

    @FXML
    ComboBox<String> dept_name;

    @FXML
    Button submit_button;

    @FXML
    Text sectionWarning;

    @FXML
    Text classNameWarning;

    @FXML
    Text departmentWarning;

    public CourseController() {}

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        dept_name.getItems().clear();
        try {
            Database database = new Database();
            ResultSet rs = database.getData("dept_code", "dept");
            while (rs.next()) {
                dept_name.getItems().add(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setStage(Stage addCourse) {
        this.addCourse = addCourse;
    }

    @FXML
    public void submitData(ActionEvent event) {
        if (dept_name.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }
        if (section_number.getText().isBlank()) {
            sectionWarning.setVisible(true);
            return;
        }
        if (class_name.getText().isBlank()) {
            classNameWarning.setVisible(true);
            return;
        }

        // section number validation. Testing it out by printing right now.
        try {
            if(section_number.getLength() == 3) {
                Integer.parseInt(section_number.getText());
            } else {
                sectionWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            sectionWarning.setVisible(true);
            return;
        }

        //made it to the end of validation, send to database and then clear fields
        // maybe update courses already added?


        //TODO: Send course to database
        File file = new File("test.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("classname: " + class_name.getText() + " deptname: " + dept_name.getValue() + " section number: " + section_number.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        dept_name.setValue("Dept name");
        section_number.clear();
        class_name.clear();
        departmentWarning.setVisible(false);
        sectionWarning.setVisible(false);
        classNameWarning.setVisible(false);
    }
}
