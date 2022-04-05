package scheduler;

import courses.Lecture;
import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
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
    private SchedulerController parentController;

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
    private Button closeButton;

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

        parentController.addCourse(appointmentList);

        // return to Scheduler
        section_number.getScene().getWindow().hide();

    }

    private List<Agenda.Appointment> createAppointment() throws ParseException {
        List<String> selectedDates = new ArrayList<>();
        for (RadioButton radioButton: datesSelected) {
            if (radioButton.isSelected()) {
                selectedDates.add(radioButton.getText());
            }
        }
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(String day: selectedDates) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + start_time.getText() + ":00")));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + end_time.getText() + ":00")));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, classNumber.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "test",section_number.getSelectionModel().getSelectedItem(), class_name.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
    }

    public LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * This method validates that each data field necessary has the required and correct data type
     */
    private void validateData() {

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

    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }
}
