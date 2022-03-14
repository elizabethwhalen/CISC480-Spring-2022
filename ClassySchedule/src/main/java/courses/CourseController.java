package courses;

import database.Database;
import javafx.collections.FXCollections;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import scheduler.SchedulerController;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.util.ResourceBundle;

public class CourseController implements Initializable {
    private Stage addCourse;

    @FXML
    private Text classNameWarning;

    @FXML
    private ComboBox<String> section_number;

    @FXML
    private ComboBox<String> class_name;

    @FXML
    private Text departmentWarning;

    @FXML
    private ComboBox<String> dept_name;

    @FXML
    private RadioButton friday;

    @FXML
    private RadioButton monday;

    @FXML
    private Text sectionWarning;

    @FXML
    private Button submit_button;

    @FXML
    private ComboBox<String> term;

    @FXML
    private RadioButton thursday;

    @FXML
    private RadioButton tuesday;

    @FXML
    private RadioButton wednesday;

    @FXML
    private ComboBox<String> year;

    @FXML
    private TextField start_time;

    @FXML
    private TextField end_time;

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

        //Testing
        class_name.getItems().add("Intro to Programming");
        class_name.getItems().add("Object-Oriented Programming");
        class_name.getItems().add("Data Structure");
        class_name.getItems().add("Information Security");
        year.getItems().add("2021");
        year.getItems().add("2022");
        term.getItems().add("Fall");
        term.getItems().add("Spring");
        term.getItems().add("J-Term");
        term.getItems().add("Summer");
        section_number.getItems().add("131");
        section_number.getItems().add("230");
        section_number.getItems().add("231");
        section_number.getItems().add("350");


    }

    public void setStage(Stage addCourse) {
        this.addCourse = addCourse;
    }

    // This method checks for the days of the week that the user clicked on and return a String output of those days.
    private String selectedDates(RadioButton monday, RadioButton tuesday, RadioButton Wednesday, RadioButton thursday, RadioButton Friday) {
        StringBuilder string = new StringBuilder();
        if(monday.isSelected()) {
            string.append(monday.getText() + " ");
        }
        if(tuesday.isSelected()) {
            string.append(tuesday.getText() + " ");
        }
        if(wednesday.isSelected()) {
            string.append(wednesday.getText() + " ");
        }
        if(thursday.isSelected()) {
            string.append(thursday.getText() + " ");
        }
        if(friday.isSelected()) {
            string.append(friday.getText() + " ");
        }
        String retVal = string.toString();
        return retVal;
    }

    @FXML
    public void submitData(ActionEvent event) throws IOException {
        if (dept_name.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }
        if (section_number.getSelectionModel().isEmpty()) {
            sectionWarning.setVisible(true);
            return;
        }
        if (class_name.getSelectionModel().isEmpty()) {
            classNameWarning.setVisible(true);
            return;
        }

/*        // section number validation. Testing it out by printing right now.
        try {
            if(section_number.getLength() == 3) {
                Integer.parseInt(section_number.getText());
            } else {
                sectionWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            sectionWarning.setVisible(true);
            return;
        }*/

        //made it to the end of validation, send to database and then clear fields
        // maybe update courses already added?


        //TODO: Send course to database
        File file = new File("test.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Year: " + year.getValue() + " Term: " + term.getValue()
                        + " \nDays: " + selectedDates(monday, tuesday, wednesday, thursday, friday)
                        + " \nDepartment: " + dept_name.getValue() + " \nClass Name: " + class_name.getValue()
                        + " \nSection Number: " + section_number.getValue());
                      //  + " \nStart-Time: " + start_time.getText() + " End-Time: " + end_time.getText());

            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }


        /* To Do from here down. */
        Lecture lecture = new Lecture(class_name.getValue(), Integer.parseInt(section_number.getValue()), dept_name.getValue());

        dept_name.setValue("Dept name");
        section_number.setValue("Section number");
        class_name.setValue("Class name");
        departmentWarning.setVisible(false);
        sectionWarning.setVisible(false);
        classNameWarning.setVisible(false);

        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(getClass().getResource("/resources/fxml/scheduler.fxml"));
        Parent parent = loader.load();
        Scene scene = new Scene(parent);

        SchedulerController controller = loader.getController();
        controller.addCourse(lecture);

        Stage stage = (Stage)((Node)event.getSource()).getScene().getWindow();
        stage.setScene(scene);
        stage.show();
    }
}
