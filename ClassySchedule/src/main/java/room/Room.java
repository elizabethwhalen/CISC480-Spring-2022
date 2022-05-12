package room;

public class Room {
    private String buildingCode;
    private String roomNum;
    private int capacity;

    public Room(String buildingCode, String roomNum, int capacity) {
        this.buildingCode = buildingCode;
        this.roomNum = roomNum;
        this.capacity = capacity;
    }

    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(String roomNum) {
        this.roomNum = roomNum;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String toString() {
        return "";
    }
}
