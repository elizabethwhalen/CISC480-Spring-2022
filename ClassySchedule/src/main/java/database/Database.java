package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;



public class Database {
    final String url = "classy-schedule-database.mysql.database.azure.com";
    final String user = "db_test";
    final String password = "fA!6#_&eaU9-EaeJ";

    public Database() {
        Connection conn = null;
        try {
            String url = "jdbc:mssql:path-to-db-file/chinook/chinook.db";
            conn = DriverManager.getConnection(url);
        } catch (SQLException e) {
            System.out.println("Connection failed");
        }
    }
}

