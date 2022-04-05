package scheduler;

import alert.AlertBox;
import courses.Lecture;
import database.Database;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.TilePane;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;

import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

public class AddCourseToScheduleController implements Initializable {
    private Stage currentStage;

    @FXML
    private ComboBox<String> section_number;

    @FXML
    private ComboBox<String> class_name;

    @FXML
    private ComboBox<String> dept_name;

    @FXML
    private Button submit_button;

    @FXML
    private RadioButton monday;

    @FXML
    private RadioButton tuesday;

    @FXML
    private RadioButton wednesday;

    @FXML
    private RadioButton thursday;

    @FXML
    private RadioButton friday;

    @FXML
    private TextField start_time;

    @FXML
    private TextField end_time;

    @FXML
    private ComboBox<String> classNumber;

    @FXML
    private Button backButton;

    @FXML
    private ComboBox<String> room;

    List<RadioButton> datesSelected;

    public AddCourseToScheduleController() {
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        datesSelected = Arrays.asList(monday, tuesday, wednesday, thursday, friday);
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
        // TODO: Get class name, class sections, available rooms from database
        class_name.getItems().add("Intro to Programming");
        class_name.getItems().add("Object-Oriented Programming");
        class_name.getItems().add("Data Structure");
        class_name.getItems().add("Information Security");
        section_number.getItems().add("131");
        section_number.getItems().add("230");
        section_number.getItems().add("231");
        section_number.getItems().add("350");
    }

    public void setStage(Stage stage) {
        this.currentStage = stage;
    }

    @FXML
    public void submitData(ActionEvent event) throws IOException, ParseException {
        // Validate needed data is present
        validateData();

        // Create appointment from fields
        List<Agenda.Appointment> appointmentList = createAppointment();


        // return to Scheduler
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler.fxml"));
        Parent root = loader.load();
        SchedulerController schedulerController = loader.getController();
        schedulerController.setStage(currentStage);
        schedulerController.addCourse(appointmentList);
        currentStage.setTitle("Classy-Schedule");
        currentStage.setScene(new Scene(root, 600, 450));
        currentStage.show();
    }

    private List<Agenda.Appointment> createAppointment() throws ParseException {
        List<String> selectedDates = new ArrayList<>();
        for (RadioButton radioButton: datesSelected) {
            if (radioButton.isSelected()) {
                selectedDates.add(radioButton.getText());
            }
        }
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date startDate = df.parse("2022-03-31" + " " + start_time.getText() + ":00");
        Date endDate = df.parse("2022-03-31" + " " + end_time.getText() + ":00");
        AppointmentFactory appointmentFactory = new AppointmentFactory(selectedDates, startDate, endDate, classNumber.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "test",section_number.getSelectionModel().getSelectedItem(), class_name.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
    }

    public LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * This method validates that each data field necessary has the required and correct data type
     * by calling all the validating methods.
     */
    private void validateData() {
        validateDates();
        validateDepartment();
        validateClassName();
    }

    /**
     * This function validates the section number. If nothing is selected, then it will prompt the user
     * to select a section number
     */
    private void validateSectionNumber() {
        // If the section number has not been selected
        if(this.section_number.getSelectionModel().isEmpty()) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select a section number."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     */
    private void validateClassName() {
        // If the class name has not been selected
        if(this.class_name.getSelectionModel().isEmpty()) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select a class name."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
        // Probably need to find a way to bind class number and class name??
    }

    /**
     * This function validate the class number. If nothing is selected, then it will prompt the user
     * to select a class number.
     */
    private void validateClassNumber() {
        // If the class number has not been selected
        if(this.classNumber.getSelectionModel().isEmpty()) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select a class number."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
    }

    /**
     * This function validate the department of the newly added class. If nothing is selected,
     * then it will prompt the user to select a department.
     */
    private void validateDepartment() {
        // If the department has not been selected
        if(this.dept_name.getSelectionModel().isEmpty()) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select a department."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
    }

    /**
     * This function validate a classroom. If nothing is selected, then it will prompt
     * the user to select a room.
     */
    private void validateRoom() {
        // If the room has not been selected
        if(this.room.getSelectionModel().isEmpty()) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select a room."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
    }

    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     */
    private void validateDates() {
        boolean result;

        result = false;

        // Iterate through all 5 days to check if at least 1 day is checked.
        // If so, set the boolean to true and break.
        for(RadioButton day : datesSelected) {
            if(day.isSelected()) {
                result = true;
                break;
            }
        }

        // boolean outcome is false, meaning none of the days has been selected, so
        // use JavaFX to prompt the user to select at least 1 day of the week.
        if(result == false) {
            // Set the submit button to return an error
            submit_button.setOnAction(e -> AlertBox.display("Please select the day/days of the week the class will have."));
        } else {
            // Remove the error property so that submit can function as normal
            submit_button.disarm();
        }
    }
    /**
     * This method takes a given lecture object turn it into a string using StringBuilder to use
     * for setting the displayCourse object strings.
     *
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
