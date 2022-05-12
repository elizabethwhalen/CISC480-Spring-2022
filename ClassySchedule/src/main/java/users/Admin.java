package users;


public class Admin implements User {

    private String firstName;
    private String lastName;
    private int id;
    private float remainingTeachLoad;
    private int prepNum;
    private String password;
    //TODO: Add list of preferences

    //TODO: Add comments
    public Admin(String firstName, String lastName, int id, float remainingTeachLoad, int prepNum, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.id = id;
        this.remainingTeachLoad = remainingTeachLoad;
        this.prepNum = prepNum;
        this.password = password;
    }

    @Override
    public String getFirstName() {
        return firstName;
    }

    @Override
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Override
    public String getLastName() {
        return lastName;
    }

    @Override
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    @Override
    public float getTeachLoad() {
        return remainingTeachLoad;
    }

    @Override
    public void setTeachLoad(float teachLoad) {
        this.remainingTeachLoad = teachLoad;
    }

    @Override
    public int getPrepNum() {
        return prepNum;
    }

    @Override
    public void setPrepNum(int prepNum) {
        this.prepNum = prepNum;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
    }

}
