package database;

import org.apache.hc.client5.http.classic.methods.HttpDelete;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.classic.methods.HttpPut;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.net.URIBuilder;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.AbstractMap;
import java.util.List;

public class Database {

    private final String url = "http://classy-api.ddns.net/";

    public Database() {}

    /**
     * This methods inserts data into the database
     * @param table the table to insert into
     * @param json the data to insert into the table
     * @return true if the operation is successful, false if not
     * @throws URISyntaxException
     * @throws IOException
     */
    public boolean insertData(String table, JSONObject json) throws URISyntaxException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url + table);
        StringEntity entity = new StringEntity(json.toString());
        HttpPost httpPost = new HttpPost(builder.build());
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setEntity(entity);
        CloseableHttpResponse response = client.execute(httpPost);
        client.close();
        return response.getCode() == 200;
    }

    /**
     * This gets data from a table with specific attributes
     * @param table the table to get the data from
     * @param requestedColumns the specific attributes to search for
     * @return a JSON array with the values from the search
     * @throws URISyntaxException
     */
    public JSONArray getData(String table, List<AbstractMap.SimpleEntry<String, String>> requestedColumns) throws URISyntaxException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        URIBuilder builder = new URIBuilder(url + table);
        for (AbstractMap.SimpleEntry<String, String> value: requestedColumns) {
            builder.addParameter(value.getKey(), value.getValue());
        }
        JSONArray jsonArray = null;
        HttpGet httpGet = new HttpGet(builder.build());
        try {
            CloseableHttpResponse response1 = client.execute(httpGet);
            HttpEntity entity1 = response1.getEntity();
            jsonArray = new JSONArray(EntityUtils.toString(entity1));
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
        client.close();
        return jsonArray;
    }


    /**
     * Gets all the data from a specified table
     * @param table the table to get data from
     * @return
     */
    public JSONArray getData(String table) {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url + table);
        JSONArray jsonArray = null;
        try {
            CloseableHttpResponse response1 = client.execute(httpGet);
            HttpEntity entity1 = response1.getEntity();
            jsonArray = new JSONArray(EntityUtils.toString(entity1));
            client.close();
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
        return jsonArray;
    }

    /**
     * Updates the data in a specified table
     * @param table the table to update
     * @param json the fields to update
     * @return true if the update is successful, false otherwise
     * @throws URISyntaxException
     * @throws IOException
     */
    // TODO:  CURRENTLY OUT OF ORDER DO NOT USE
    public boolean updateData(String table, JSONObject json) throws URISyntaxException, IOException {
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
     * @return
     */
    public boolean deleteData(String table, JSONObject json) throws URISyntaxException, IOException {
        RequestConfig requestConfig = RequestConfig.custom().setCircularRedirectsAllowed(true).build();
        CloseableHttpClient test = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();

        URIBuilder builder = new URIBuilder(url + table);
        for (String key: json.keySet()) {
            builder.addParameter(key, (String) json.get(key));
        }
        HttpDelete httpDelete = new HttpDelete(builder.build());

        CloseableHttpResponse response = test.execute(httpDelete);
        test.close();
        return response.getCode() == 200;
    }
}

