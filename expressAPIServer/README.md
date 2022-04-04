# Express API Server
**Classy-Schedule Express API Server Development Repository**
</br></br>
NOTE: PLEASE CONECT TO THE API SERVER WITH THE FOLLOWING LINK: databaseconnectionexample.azurewebsites.net
</br></br>
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
- **View something** (i.e. GET): $curl -X GET "http://localhost:4000/getDept"
- **View something** (i.e. GET): $curl -X GET "http://localhost:4000/getClass?dept_code=STAT"
- **Add something** (i.e. POST): $curl -X POST "http://localhost:4000/addClass?dept_code=STAT&class_num=101&class_name=Introduction+to+Statistics"
    - Note: If an error from database is the response, the entry probably already exists or something more serious happened. Either way, we are working to increase error verbosity.


## Azure Deployment
To deploy the Express API Server to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd expressAPIServer
2. $npm install
3. Install Visual Studio Code
4. Install Azure App Service extension for Visual Studio Code
5. Sign into your Azure account (Database Team members)
6. $code .
7. Select the "expressAPIServer" folder
8. Click the "Deploy to Web App" icon and select "classy-schedule-api"
</br>
Note: Before deploying to Azure, make sure to change the 
</br></br>
Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal

### Connection via cURL
From another terminal, submit HTTP requests to "http://classy-api.ddns.net". Here are some examples to connect to the API via [cURL](https://curl.se/):
- **View something** (i.e. GET): $curl -X GET "http://classy-api.ddns.net/getDept"
- **View something** (i.e. GET): $curl -X GET "http://classy-api.ddns.net/getClass?dept_code=STAT"
- **Add something** (i.e. POST): $curl -X POST "http://classy-api.ddns.net/addClass?dept_code=STAT&class_num=101&class_name=Introduction+to+Statistics"
  - Note: If an error from database is the response, the entry probably already exists or something more serious happened. Either way, we are working to increase error verbosity.
