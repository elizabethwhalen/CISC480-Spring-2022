package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.logging.Logger;



public class Database {

    private static final Logger log;
    private String password = "fA!6#_&eaU9-EaeJ";
    private String url = "jdbc:mysql://classy-schedule-database.mysql.database.azure.com:3306/classy_schedule?useSSL=true";

    private Connection connection;
    static {
        System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
        log = Logger.getLogger(Database.class.getName());
    }

    public Database() throws Exception {
        //initialize database connection
        log.info("Connecting to the database");
        connection = DriverManager.getConnection(url, "db_test", password);
    }

    public boolean insertData() {

        return false;
    }

    public ResultSet getData(String requestedColumns, String table) {
        String statement = "SELECT " + requestedColumns + " FROM " + table;
        try {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(statement);
            return rs;
        } catch (SQLException e) {
            return null;
        }
    }

    public boolean updateData() {
        return false;
    }

    public boolean deleteData() {
        return false;
    }

    public void closeConnection() {
        try {
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

