package database;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;
import java.util.Scanner;
import java.util.logging.Logger;



public class Database {

    private static final Logger log;
    private static String password = "fA!6#_&eaU9-EaeJ";

    static {
        System.setProperty("java.util.logging.SimpleFormatter.format", "[%4$-7s] %5$s %n");
        log = Logger.getLogger(Database.class.getName());
    }

    public Database() throws Exception {
        String url="jdbc:mysql://classy-schedule-database.mysql.database.azure.com:3306/classy_schedule?useSSL=true";
        log.info("Connecting to the database");
        Connection myDbConn = DriverManager.getConnection(url, "db_test", password);
        //log.info("Loading application properties");
        //Properties properties = new Properties();
        //properties.load(Database.class.getClassLoader().getResourceAsStream("resources/database/application.properties"));


        //Connection connection = DriverManager.getConnection(properties.getProperty("url"), properties);
        log.info("Database connection test: " + myDbConn.getCatalog());

        Statement stmt = myDbConn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM courses");
        log.info("result set: " + rs.toString());
        //Scanner scanner = new Scanner(Database.class.getClassLoader().getResourceAsStream("schema.sql"));
        //Statement statement = myDbConn.createStatement();
        //while (scanner.hasNextLine()) {
        //    statement.execute(scanner.nextLine());
        //}

		/*
		Todo todo = new Todo(1L, "configuration", "congratulations, you have set up JDBC correctly!", true);
        insertData(todo, connection);
        todo = readData(connection);
        todo.setDetails("congratulations, you have updated data!");
        updateData(todo, connection);
        deleteData(todo, connection);
		*/

        log.info("Closing database connection");
        myDbConn.close();
    }


//    final String url = "classy-schedule-database.mysql.database.azure.com";
//    final String user = "db_test";
//    final String password = "fA!6#_&eaU9-EaeJ";
//
//    public Database() {
//        Connection conn = null;
//        try {
//            String url = "jdbc:mssql:path-to-db-file/chinook/chinook.db";
//            conn = DriverManager.getConnection(url);
//        } catch (SQLException e) {
//            System.out.println("Connection failed");
//        }
//    }
}

