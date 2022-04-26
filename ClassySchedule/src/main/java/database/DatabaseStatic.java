package database;

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

public final class DatabaseStatic {
    private static final String url = "https://classy-api.ddns.net/v2/";
    private static JSONObject tokenObject = null;

    /**
     * Verifies the given credentials. Populates the token object to be used
     * for future database requests
     *
     * @param username the username to be checked
     * @param password the password to be checked
     * @return true if the user is valid, false otherwise
     */
    public static boolean login(String username, String password) {
        try {
            int timeout = 5;
            RequestConfig config = RequestConfig.custom()
                    .setConnectTimeout(Timeout.ofMilliseconds(timeout * 1000))
                    .setConnectionRequestTimeout(Timeout.ofMilliseconds(timeout * 1000))
                    .setResponseTimeout(Timeout.ofMilliseconds(timeout * 1000)).build();
            CloseableHttpClient client = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
            URIBuilder builder = new URIBuilder(url + "login");
            JSONObject json = new JSONObject();
            json.put("password", password);
            json.put("username", username);
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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tokenObject != null;
    }

    /**
     * This methods inserts data into the database
     *
     * @param table the table to insert into
     * @param json  the data to insert into the table
     * @return true if the operation is successful, false if not
     * @throws URISyntaxException
     * @throws IOException
     */
    public static boolean insertData(String table, JSONObject json) throws URISyntaxException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        json.put("token", tokenObject.get("token"));
        URIBuilder builder = new URIBuilder(url + table);
        StringEntity entity = new StringEntity(json.toString());
        HttpPost httpPost = new HttpPost(builder.build());
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));

        httpPost.setEntity(entity);
        CloseableHttpResponse response = client.execute(httpPost);
        client.close();
        return response.getCode() == 200;
    }

    /**
     * This gets data from a table with specific attributes
     *
     * @param table            the table to get the data from
     * @param requestedColumns the specific attributes to search for
     * @return a JSON array with the values from the search
     * @throws URISyntaxException
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
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Gets all the data from a specified table
     *
     * @param table the table to get data from
     * @return
     */
    public static JSONArray getData(String table) {
        HttpGet httpGet = new HttpGet(url + table);
        return executeGet(httpGet);
    }

    /**
     * Executes the given get request
     * Returns a JSONArray or null if not present in database
     */
    private static JSONArray executeGet(HttpGet getRequest) {
        JSONArray jsonArray = null;
        try {
            CloseableHttpClient client = HttpClients.createDefault();
            getRequest.setEntity(new StringEntity(tokenObject.toString()));
            getRequest.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));
            CloseableHttpResponse response1 = client.execute(getRequest);
            HttpEntity entity = response1.getEntity();
            jsonArray = new JSONArray(EntityUtils.toString(entity));
            client.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonArray;
    }


    /**
     * Updates the data in a specified table
     *
     * @param table the table to update
     * @param json  the fields to update
     * @return true if the update is successful, false otherwise
     * @throws URISyntaxException
     * @throws IOException
     */
    // TODO:  CURRENTLY OUT OF ORDER DO NOT USE
    public static boolean updateData(String table, JSONObject json) throws URISyntaxException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url + table);
        StringEntity entity = new StringEntity(json.toString());
        HttpPut httpPut = new HttpPut(builder.build());
        httpPut.setHeader("Content-Type", "application/json");
        httpPut.setEntity(entity);
        CloseableHttpResponse response = client.execute(httpPut);
        client.close();
        return response.getCode() == 200;
    }

    /**
     * Deletes a specified object from the database
     *
     * @return
     */
    public static boolean deleteData(String table, JSONObject json) throws URISyntaxException, IOException {
        RequestConfig requestConfig = RequestConfig.custom().setCircularRedirectsAllowed(true).build();
        CloseableHttpClient test = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();

        URIBuilder builder = new URIBuilder(url + table);
        for (String key : json.keySet()) {
            builder.addParameter(key, (String) json.get(key));
        }

        HttpDelete httpDelete = new HttpDelete(builder.build());

        httpDelete.setEntity(new StringEntity(tokenObject.toString()));
        httpDelete.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenObject.get("token"));

        CloseableHttpResponse response = test.execute(httpDelete);
        test.close();
        return response.getCode() == 200;
    }
}