package scheduler;

import jfxtras.scene.control.agenda.Agenda;

//TODO: either delete this class or implement groups based on room creation
public class AppointmentGroups implements Agenda.AppointmentGroup {
    @Override
    public String getDescription() {
        return null;
    }

    @Override
    public void setDescription(String s) {

    }

    @Override
    public String getStyleClass() {
        return null;
    }

    @Override
    public void setStyleClass(String s) {

    }
}
