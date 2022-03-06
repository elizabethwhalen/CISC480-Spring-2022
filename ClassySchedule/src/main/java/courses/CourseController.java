package courses;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
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

    public CourseController() {

    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        dept_name.getItems().clear();

        //TO
        dept_name.getItems().addAll(
                "jacob.smith@example.com",
                "isabella.johnson@example.com",
                "ethan.williams@example.com",
                "emma.jones@example.com",
                "michael.brown@example.com");
    }

    public void setStage(Stage addCourse) {
        this.addCourse = addCourse;
    }

    @FXML
    public void submitData(ActionEvent event) {
        /* TODO: validate user entry: section number must be a 3-digit number
            Get list of department names from the database
        * */
        if (dept_name.getSelectionModel().isEmpty()) {
            System.out.println("Must select dept name");
            return;
        }
        if (section_number.getText().isBlank()) {
            System.out.println("Must enter section number");
            return;
        }
        if (class_name.getText().isBlank()) {
            System.out.println("Must enter class name");
            return;
        }

        // section number validation. Testing it out by printing right now.
        try {
            if(section_number.getLength() == 3) {
                Integer.parseInt(section_number.getText());
                return;
            } else {
                System.out.println("Must be 3 digits number");
            }
        } catch (NumberFormatException e) {
            System.out.println("Please enter a number");
        }

        File file = new File("test.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("classname: " + class_name.getText() + " deptname: " + dept_name.getValue() + " section number: " + section_number.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
