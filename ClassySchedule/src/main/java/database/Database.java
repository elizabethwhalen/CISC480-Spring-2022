package database;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.classic.methods.HttpPut;
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
    private final CloseableHttpClient client;

    public Database() {
        client = HttpClients.createDefault();
    }

    /**
     * This methods inserts data into the database
     * @param table the table to insert into
     * @param json the data to insert into the table
     * @return true if the operation is successful, false if not
     * @throws URISyntaxException
     * @throws IOException
     */
    public boolean insertData(String table, JSONObject json) throws URISyntaxException, IOException {
        URIBuilder builder = new URIBuilder(url + table);
        StringEntity entity = new StringEntity(json.toString());
        HttpPost httpPost = new HttpPost(builder.build());
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setEntity(entity);
        CloseableHttpResponse response = client.execute(httpPost);
        return response.getCode() == 200;
    }

    /**
     * This gets data from a table with specific attributes
     * @param table the table to get the data from
     * @param requestedColumns the specific attributes to search for
     * @return a JSON array with the values from the search
     * @throws URISyntaxException
     */
    public JSONArray getData(String table, List<AbstractMap.SimpleEntry<String, String>> requestedColumns) throws URISyntaxException {
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
        return jsonArray;
    }


    /**
     * Gets all the data from a specified table
     * @param table the table to get data from
     * @return
     */
    public JSONArray getData(String table) {
        HttpGet httpGet = new HttpGet(url + table);
        JSONArray jsonArray = null;
        try {
            CloseableHttpResponse response1 = client.execute(httpGet);
            HttpEntity entity1 = response1.getEntity();
            jsonArray = new JSONArray(EntityUtils.toString(entity1));
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
    public boolean updateData(String table, JSONObject json) throws URISyntaxException, IOException {
        URIBuilder builder = new URIBuilder(url + table);
        StringEntity entity = new StringEntity(json.toString());
        HttpPut httpPut = new HttpPut(builder.build());
        httpPut.setHeader("Content-Type", "application/json");
        httpPut.setEntity(entity);
        CloseableHttpResponse response = client.execute(httpPut);
        System.out.println(response.getCode());
        return response.getCode() == 200;
    }
    //going to use put?

    public boolean deleteData() {
        return false;
    }
    //going to use delete
}

