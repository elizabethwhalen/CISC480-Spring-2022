package courses;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.SyncFailedException;

public class CourseController {
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

    public void setData(){

        dept_name.getItems().clear();

        dept_name.getItems().addAll(
                "jacob.smith@example.com",
                "isabella.johnson@example.com",
                "ethan.williams@example.com",
                "emma.jones@example.com",
                "michael.brown@example.com");

        submit_button.setOnAction(value ->  {
            submitData();
         });

    }

    public void submitData() {
        File file = new File("C:\\Users\\dtbie\\OneDrive\\Documents\\test.txt");
        try {
            FileWriter fw = new FileWriter(file);
            System.out.println("classname: " + class_name.getText() + " deptname: " + dept_name.getValue() + " section number: " + section_number.getText());
            fw.write("classname: " + class_name.getText() + " deptname: " + dept_name.getValue() + " section number: " + section_number.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
