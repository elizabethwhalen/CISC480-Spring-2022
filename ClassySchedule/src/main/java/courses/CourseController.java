package courses;

import database.Database;
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
    private ComboBox<String> section_number;

    @FXML
    private ComboBox<String> class_name;

    @FXML
    private ComboBox<String> dept_name;

    @FXML
    private RadioButton friday;

    @FXML
    private RadioButton monday;

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

      // Testing; Hard-coded courses into the drop-down boxes
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

    /**
     * This method checks the user selected date and return them in string format
     * @return the string of the selected day/days of the week; e.g. "Monday", "Tuesday", etc...
     */
    private String selectedDatesToString() {
      StringBuilder string = new StringBuilder();

      if (this.monday.isSelected()) {
        string.append(this.monday.getText() + " ");
      }

      if (this.tuesday.isSelected()) {
        string.append(this.tuesday.getText() + " ");
      }

      if (this.wednesday.isSelected()) {
        string.append(this.wednesday.getText() + " ");
      }

      if (this.thursday.isSelected()) {
        string.append(this.thursday.getText() + " ");
      }

      if (this.friday.isSelected()) {
        string.append(this.friday.getText() + " ");
      }

      String retVal = string.toString();
      return retVal;
    }

    @FXML
    public void submitData(ActionEvent event) throws IOException {

      //TODO: Send course to database
      File file = new File("test.txt");
      try {
        FileWriter fw = new FileWriter(file);
        fw.append("Year: " + year.getValue() + " Term: " + term.getValue()
                        + " \nDays: " + selectedDatesToString()
                        + " \nDepartment: " + dept_name.getValue() + " \nClass Name: " + class_name.getValue()
                        + " \nSection Number: " + section_number.getValue());
        fw.close();
      } catch (IOException e) {
        e.printStackTrace();
      }

      FXMLLoader loader = new FXMLLoader();
      loader.setLocation(getClass().getResource("/resources/fxml/scheduler.fxml"));
      Parent parent = loader.load();
      Scene scene = new Scene(parent);
      SchedulerController controller = loader.getController();

      Lecture lecture = new Lecture(class_name.getValue(), Integer.parseInt(section_number.getValue()), dept_name.getValue());
      DisplayCourse displayCourse = new DisplayCourse();
      if(monday.isSelected()) {
        displayCourse.setMonday(lectureToDisplayCourse(lecture));
      }
      if(tuesday.isSelected()) {
        displayCourse.setTuesday(lectureToDisplayCourse(lecture));
      }
      if(wednesday.isSelected()) {
        displayCourse.setWednesday(lectureToDisplayCourse(lecture));
      }
      if(thursday.isSelected()) {
        displayCourse.setThursday(lectureToDisplayCourse(lecture));
      }
      if(friday.isSelected()) {
        displayCourse.setFriday(lectureToDisplayCourse(lecture));
      }

      controller.addCourse(displayCourse);

      dept_name.setValue("Dept name");
      section_number.setValue("Section number");
      class_name.setValue("Class name");

      Stage stage = (Stage)((Node)event.getSource()).getScene().getWindow();
      stage.setScene(scene);
      stage.show();
    }

    /**
     * This method takes a given lecture object turn it into a string using StringBuilder to use
     * for setting the displayCourse object strings.
     * @param lecture a given lecture object to reference its necessary information
     * @return a string output of the necessary lecture information
     */
    private String lectureToDisplayCourse(Lecture lecture) {
        StringBuilder sb = new StringBuilder();
        sb.append(lecture.getClassName() + "\n");
        sb.append(lecture.getSectionNumber() + "\n");
        sb.append(lecture.getDepartment());
        String output;
        output = sb.toString();
        System.out.println(output);
        return output;
    }
}
