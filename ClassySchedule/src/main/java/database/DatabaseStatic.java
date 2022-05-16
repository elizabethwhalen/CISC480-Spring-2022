package database;

import alert.MyAlert;
import javafx.scene.control.Alert;
import org.apache.hc.client5.http.classic.methods.HttpDelete;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.classic.methods.HttpPut;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.HttpHeaders;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.net.URIBuilder;
import org.apache.hc.core5.util.Timeout;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Timer;
import java.util.TimerTask;

public final class DatabaseStatic {
    private static final String url = "https://classy-api.ddns.net/v2/";
    private static JSONObject tokenObject = null;
    private static Timer timer = new Timer();

    /**
     * Verifies the given credentials. Populates the token object to be used
     * for future database requests
     *
     * @param email    the email to be checked
     * @param password the password to be checked
     * @return true if the user is valid, false otherwise
     */
    public static boolean login(String email, String password) {
        try {
            int timeout = 10;
            RequestConfig config = RequestConfig.custom()
                    .setConnectTimeout(Timeout.ofMilliseconds(timeout * 1000))
                    .setConnectionRequestTimeout(Timeout.ofMilliseconds(timeout * 1000))
                    .setResponseTimeout(Timeout.ofMilliseconds(timeout * 1000)).build();
            CloseableHttpClient client = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
            URIBuilder builder = new URIBuilder(url + "login");
            JSONObject json = new JSONObject();
            json.put("password", password);
            json.put("email", email);
            StringEntity entity = new StringEntity(json.toString());
            HttpPost httpPost = new HttpPost(builder.build());
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setEntity(entity);
            CloseableHttpResponse response = client.execute(httpPost);
            if (response.getCode() == 200) {
                tokenObject = new JSONObject();
                tokenObject.put("token", EntityUtils.toString(response.getEntity()));
            }
            client.close();
        } catch (UnknownHostException e) {
                new MyAlert("No internet connection", "Could not connect to the internet, please check" +
                        "your connection and try again", Alert.AlertType.WARNING).show();

        } catch (Exception e) {
            // login did not work, return false
            return false;
        }

        //if successful, we need to re-login every 24 hours so start a timer
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                login(email, password);
            }
        };
        timer.schedule(task, 1000 * 86400, 1000 * 86400);
        return tokenObject != null;
    }

    /**
     * This gets data from a table with specific attributes
     *
     * @param table            the table to get the data from
     * @param requestedColumns the specific attributes to search for
     * @return a JSON array with the values from the search
     */
    public static JSONArray getData(String table, JSONObject requestedColumns) {
        try {
            URIBuilder builder = new URIBuilder(url + table);
            for (String string : requestedColumns.keySet()) {
                builder.addParameter(string, requestedColumns.getString(string));
            }
            HttpGet httpGet = new HttpGet(builder.build());
            return executeGet(httpGet);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Gets all the data from a specified table
     *
     * @param table the table to get data from
     * @return the JSONArray returned from the database
     */
    public static JSONArray getData(String table) {
        HttpGet httpGet = new HttpGet(url + table);
        return executeGet(httpGet);
    }

    // Two specialized get requests

    /**
     * A special query that joins the meets and teaches tables
     * @return the array from the meets query
     */
    public static JSONArray meetsQuery() {
        String ur = "https://classy-api.ddns.net/";
        HttpGet httpGet = new HttpGet(ur + "v3/meets/ext");
        return executeGet(httpGet);
    }

    /**
     * A special query that joins the section and classes table
     * @return the JSONArray from the section query
     */
    public static JSONArray sectionQuery() {
        String ur = "https://classy-api.ddns.net/";
        HttpGet httpGet = new HttpGet(ur + "v3/section/ext");
        return executeGet(httpGet);
    }

    /**
     * Executes the given get request
     * Returns a JSONArray or null if not present in database
     */
    private static JSONArray executeGet(HttpGet getRequest) {
        JSONArray jsonArray;
        try {
            CloseableHttpClient client = HttpClients.createDefault();
            getRequest.setEntity(new StringEntity(tokenObject.toString()));
            getRequest.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));
            CloseableHttpResponse response1 = client.execute(getRequest);
            HttpEntity entity = response1.getEntity();
            jsonArray = new JSONArray(EntityUtils.toString(entity));
            client.close();
        } catch (UnknownHostException e) {
            new MyAlert("No internet connection", "Database connection error, please ensure" +
                    " you are connected to the internet to view information", Alert.AlertType.WARNING);
            return null;
        } catch (Exception e) {
            return null;
        }
        return jsonArray;
    }

    /**
     * This methods inserts data into the database
     *
     * @param table the table to insert into
     * @param json  the data to insert into the table
     * @return true if the operation is successful, false if not
     */
    public static boolean insertData(String table, JSONObject json) {
        CloseableHttpClient client = HttpClients.createDefault();
        json.put("token", tokenObject.get("token"));
        try {
            URIBuilder builder = new URIBuilder(url + table);

            StringEntity entity = new StringEntity(json.toString());
            HttpPost httpPost = new HttpPost(builder.build());
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));

            CloseableHttpResponse response = client.execute(httpPost);
            client.close();
            return response.getCode() == 200;
        } catch (UnknownHostException e) {
            // TODO: write to file
            System.out.println("INternet disconected");
            return false;
        } catch (URISyntaxException | IOException e) {
            return false;
        }
    }

    /**
     * Updates the data in a specified table
     *
     * @param table the table to update
     * @param json  the fields to update
     * @return true if the update is successful, false otherwise
     */
    public static boolean updateData(String table, JSONObject json, JSONObject change) {
        CloseableHttpClient client = HttpClients.createDefault();
        try {
            URIBuilder builder = new URIBuilder(url + table);

            if (table.equals("room")) {
                builder.appendPath((String) json.get("building_code"));
                builder.appendPath((String) json.get("room_num"));
            } else {
                for (String key : json.keySet()) {
                    builder.appendPath((String) json.get(key));
                }
            }

            StringEntity entity = new StringEntity(change.toString());
            HttpPut httpPut = new HttpPut(builder.build());
            httpPut.setEntity(entity);
            httpPut.setHeader("Content-Type", "application/json");
            httpPut.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));

            CloseableHttpResponse response = client.execute(httpPut);
            client.close();
            return response.getCode() == 200;
        } catch (UnknownHostException e) {
            //TODO: write to file
            return false;
        } catch (URISyntaxException | IOException e) {
            // An exception occurred, therefore operation was not successful so return false.
            return false;
        }
    }

    /**
     * Deletes a specified object from the database
     *
     * @return true if the delete is successful, false if not
     */
    public static boolean deleteData(String table, JSONObject json) {
        RequestConfig requestConfig = RequestConfig.custom().setCircularRedirectsAllowed(true).build();
        CloseableHttpClient test = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();
        try {
            URIBuilder builder = new URIBuilder(url + table);
            if (json != null) {
                if (table.equals("room")) {
                    builder.appendPath((String) json.get("building_code"));
                    builder.appendPath((String) json.get("room_num"));
                } else {
                    for (String key : json.keySet()) {
                        builder.appendPath((String) json.get(key));
                    }
                }
            }

            HttpDelete httpDelete = new HttpDelete(builder.build());

            httpDelete.setEntity(new StringEntity(tokenObject.toString()));
            httpDelete.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));

            CloseableHttpResponse response = test.execute(httpDelete);
            test.close();
            return response.getCode() == 200;

        } catch (IOException | URISyntaxException e) {
            // An exception occurred, therefore operation was not successful so return false.
            return false;
        }
    }

    public static Timer getTimer() {
        return timer;
    }

}