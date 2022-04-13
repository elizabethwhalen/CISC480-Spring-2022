# Express API Server
**Classy-Schedule Express API Server Development Repository**
</br>
The Database Team's Express API Server accepts HTTP requests from other teams. Based
on the received HTTP requests, the API then queries one of the Database Team's MySQL
database schemeas. The resulting data is return to the API where it is then sent to
the requesting client in the form of a JSON list.
</br></br>
To deploy this folder locally or to Azure, please follow the guide below:

## Local Deployment
To run the Express API Server locally, please complete the following steps:
1. $cd expressAPIServer
2. $npm install
3. $npm start

### Connection via cURL
From another terminal, submit HTTP requests to "http://localhost:4000". Here are some examples to connect to the API via [cURL](https://curl.se/):
- **View something** $curl -X GET "http://localhost:4000/dept"
- **View something** $curl -X GET "http://localhost:4000/dept?dept_code=CISC"
- **Add something**  $curl -X POST "http://localhost:4000/class" -d "dept_code=CISC&class_num=340&class_name=Architecture"
- **Update something** $curl -X PUT "http://localhost:4000/class?dept_code=CISC&class_num=340&new_class_name=Architecture"
- **Delete something** $curl -X DELETE "http://localhost:4000/class?dept_code=CISC&class_num=340"
    - Note: If an error from database is the response, the entry probably already exists or something more serious happened. Either way, we are working to improve error messages.


## Azure Deployment

### Deployment Versions
| Date     | API ver. | URI Connection                | Status     | GitHub Commit ID                                                                                                  | Azure App Service   | Notes                                   |
|----------|----------|-------------------------------|------------|-------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------|
| 04/14    |          |                               |            |                                                                                                                   |                     |                                         |
| 04/14/22 | V1       | http://classy-api.ddns.net/v1 | Deprecated | [0c7ec99](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/0c7ec9923d5abf9030e9a63c4d0e04b285c98129) | classy-schedule-api | Original version without update working |
|          |          |                               |            |                                                                                                                   |                     |                                         |
|          |          |                               |            |                                                                                                                   |                     |                                         |

### Deployment Process
To deploy the Express API Server to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd expressAPIServer
2. Install Visual Studio Code
3. Install Azure App Service extension for Visual Studio Code
4. Sign into your Azure account (Database Team members)
5. $code .
6. Select the "expressAPIServer" folder
7. Click the "Deploy to Web App" icon and select "classy-schedule-api"
</br>
Note: Before deploying to Azure, make sure to change the 
</br></br>
Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal

### Connection via cURL
From another terminal, submit HTTP requests to "http://classy-api.ddns.net". Here are some examples to connect to the API via [cURL](https://curl.se/):
- **View something** $curl -X GET "http://classy-api.ddns.net/dept"
- **View something** $curl -X GET "http://classy-api.ddns.net/dept?dept_code=CISC"
- **Add something**  $curl -X POST "http://classy-api.ddns.net/class" -d "dept_code=CISC&class_num=340&class_name=Architecture"
- **Update something** $curl -X PUT "http://classy-api.ddns.net/class?dept_code=CISC&class_num=340&new_class_name=Architecture"
- **Delete something** $curl -X DELETE "http://classy-api.ddns.net/class?dept_code=CISC&class_num=340"
  - Note: If an error from database is the response, the entry probably already exists or something more serious happened. Either way, we are working to increase error verbosity.