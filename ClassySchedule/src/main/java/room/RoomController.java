package room;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import homescreen.HomescreenController;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController implements Initializable {

    private Stage addRoom;
    private Scene scene;
    private Parent root;

    @FXML
    TextField roomNum;

    @FXML
    ComboBox<String> buildingCode;

    @FXML
    ComboBox<String> campusID;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    @FXML
    Text roomWarning;

    @FXML
    Text buildingWarning;

    @FXML
    Text campusWarning;

    public RoomController() {
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
    }

    //May use in the future to reach into database for room options
    /*@Override
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
    }*/

    public void setStage(Stage addRoom) {
        this.addRoom = addRoom;
    }

    /**
     * Submits data that has been entered when submit button is clicked.
     * @param event submit button being clicked
     */
    @FXML
    public void submitData(ActionEvent event) {

        if (campusID.getSelectionModel().isEmpty()) {
            campusWarning.setVisible(true);
            return;
        }
        if (roomNum.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (buildingCode.getSelectionModel().isEmpty()) {
            buildingWarning.setVisible(true);
            return;
        }

        // room number validation
        try {
            if(roomNum.getLength() == 3) {
                Integer.parseInt(roomNum.getText());
            } else {
                roomWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            roomWarning.setVisible(true);
            return;
        }

        //made it to the end of validation, send to database and then clear fields
        //TODO: Send course to database instead of text file
        File file = new File("testroom.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Campus: " + campusID.getValue() + " building: " + buildingCode.getValue() + " Room number: " + roomNum.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        campusID.setValue(null);
        roomNum.clear();
        buildingCode.setValue(null);
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        campusWarning.setVisible(false);
    }

    /**
     * Changes scene back to homescreen when cancelButton is clicked
     * @param event Clicking on cancelButton
     */
    @FXML
    public void cancelButtonClicked(ActionEvent event) {
        System.out.println("Cancel button clicked");
        try {
            Parent root = FXMLLoader.load(getClass().getResource("/resources/fxml/Homescreen.fxml"));
            addRoom = (Stage) ((Node) event.getSource()).getScene().getWindow();
            Scene scene = new Scene(root);
            addRoom.setScene(scene);
            addRoom.show();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }


}
