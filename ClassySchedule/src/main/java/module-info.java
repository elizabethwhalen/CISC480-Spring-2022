module ClassySchedule.main {
    requires javafx.base;
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires java.sql;

    opens samples;
    opens courses;
    opens login;
    opens scheduler;
}