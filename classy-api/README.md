# Classy-Schedule API Server
__NOTE: For information on how to connect to the azure-hosted API server, please see [docs/versioning.md](/docs/versioning.md)__
</br></br>
## API Overview
The API component of the final product is a Node JS Express-based RESTful API server. The API server facilitates HTTP requests from applications developed by the other development teams. HTTP requests can also be submitted to the API via cURL requests or any other HTTP request generation and submission program. Additionally, our API includes full SQL sanitization to prevent malicious or unknown code being injected into the database and therefore doing harm to either the entire product or specific user data. Multiple versions of the API have been developed and documented during this project. The final API uses a mixture of v2 and v3 functions to carryout functionality for maximum security. API v0 functions have been deprecated and removed from the final product of the API server. 

## API Access Description
To access the API server, first, a new user must signup with an email and password using the provided API documentation. Their password is hashed and the hashed result is stored in our database. Next, the user must login to the API with their email and password. If they successfully log in, the user is sent an email with a login request verification link. Upon clicking this link, their login request is completed and they are sent a perishable token. The token will allow the user to remain logged in for one day and make HTTP requests based on their permission level. We have implemented a permission level for each user into our final product between zero and three, depending on the user’s university title/status. For more information about permission levels, please see our API documentation. 

## API Quickstart
Assumming that the Production API Server is still accessible, in order to view a class from the database, here is a quick procedure using [cURL](https://curl.se/) from a terminal:
</br>
1. **Signup**: This step creates a user account entry in our database with the user-provided email address and their hashed password.
```
$curl -d "email=<YOUREMAIL>@stthomas.edu&password=<YOURPASSWORD>" -X POST "https://classy-api.ddns.net/v2/signup"
```
2. **Login**: This step authenticates your login information and provides you with a token. This token is valid for 24 hours and must be used with all HTTP requests, such as in step 3. After submitting this request, you will be emailed a login verification to your provided email. Please click this link, then you will receive a token.
```
$curl -d "email=<YOUREMAIL>@stthomas.edu&password=<YOURPASSWORD>" -X POST "https://classy-api.ddns.net/v2/login"
```
3. **View classes**: While this is only one example of the many API use cases, you will be able to view classes currently entered in the database after this step. Please copy the token provided in step 2 and insert into the "<TOKEN>" text below:
```
$curl -H "Authorization: Bearer <TOKEN>" -X GET "https://classy-api.ddns.net/v2/class"
```

## Local Development
For local development, two terminal instances are required. The first instance instance is to run the API server on your local machine. The server will be available at the URL: "http://localhost:3000". The second instance is for accessing the API server and submitting cURL requests. 
</br></br>
To run the API Server locally, please complete the following steps:
1. $cd classy-api
2. $npm install
3. $npm start
</br></br>
To access the API Server locally, in your second instance of terminal, you may follow the "API Quickstart" guide by replacing all instances of "https://classy-api.ddns.net" with "http://localhost:3000" such as the following below. Within the [app.js](/classy-api/app.js) file, make sure the constant "dev" is set to 0 for local development:
```
$curl -d "email=<YOUREMAIL>@stthomas.edu&password=<YOURPASSWORD>" -X POST "http://localhost:3000/v2/signup"
$curl -d "email=<YOUREMAIL>@stthomas.edu&password=<YOURPASSWORD>" -X POST "http://localhost:3000/v3/login"
$curl -H "Authorization: Bearer <TOKEN>" -X POST "http://localhost:3000/v2/class"
```

## Deployment
In addition to hosting the server locally, developers can also deploy the server to the cloud. For our deployment platform, we chose to deploy or server to an [Azure Web App](https://azure.microsoft.com/en-us/services/app-service/web/). We chose to use Azure over AWS or Google Cloud because the Web Development team was familiar with the Azure platform. Azure Web Apps are created on top of Resource Groups. When creating a new App Servive (e.x., Web App), an App Service Plan must be created or selected. Due to the constraints of this project, we chose a B1 service plan because it was the cheapest plan available that accomodates custom DNS and SSL. We followed the ["Create a Node.js web app in Azure"](https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal) guide for deplying our Node.js application to Azure.
</br></br>
We have two Web Apps that are used in our workflow. First, we deploy to our Developmental API Server (i.e., the Web App named "classy-schedule-dev"). Deploying to a dev API server instance allows us to determine if there were any bugs introduced in the deployment process that were not exposed locally. Next, after running a test suite on the Developmental API Server, we then deploy to our Production API Server (i.e., the Web App named "classy-schedule-api"). We have configured Domain Name Systems (DNS) for each of these Web Apps for URL shortening and regulated access. Currently, only the Database Team uses the Developmental API Server. It is recommended to access both of the APIs through the DNS URL via HTTPS. HTTP support has been deprecated.
| Web App Name | Azure-provided URL | Custom DNS URL |
|------------|------------------------------------|--------------------------|
| classy-schedule-api | classy-schedule-api.azurewebsites.net | classy-api.ddns.net |
| classy-schedule-dev | classy-schedule-dev.azurewebsites.net | classy-dev.ddns.net |

### Deployment Versions
Since version 0 of our API Server, we have keep track of the deployments to our Production API Server. This is the API Server that the other development teams are using, so we wanted to keep track of the GitHub Commit ID associated with each deployment.
</br></br>
Note: While version 3 methods are the most recent of any given method, this does not mean that every method has a v3 version. In our current deployment, most methods are in version 2. Please see [docs/versioning.md](/docs/versioning.md) for more information.
</br></br>
Note: There is a "hidden" file containing API, password, and hashing seeds that is deployed to the Azure Web App but not listed on this GitHub. We tried deploying the hidden file but our SendGrind (API for MFA emails) account was suspended. We can provide the "hidden" file if requested.
</br>
| Date     | Highest Method Ver. | GitHub Commit ID                      |                                        Notes                                   |
|----------|----------|-------------------------------|--------------------------------------------|
| 05/13/22 | v3 | [e5adaa7](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/e5adaa7bdd2cd4cb13e9db4c5993f0691c6c637b) | class/meets/ext featyre for Desktop Team |
| 04/24/22 | v3 | [fd31615](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/fd31615614afc3c1920619136598fc7da3c9fd4b) | classy-schedule-api | Async/await and more robust options for certain tables |
| 04/20/22 | v2 | [081fe98](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/081fe98a2d5377d59a871f55291b30573c68d751) | classy-schedule-api | Login and tokens |
| 04/04/22 | v0 | [0c7ec99](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/0c7ec9923d5abf9030e9a63c4d0e04b285c98129) | classy-schedule-api | Original version without update working |

### Deployment Settings
Azure apps can be configured in many different ways. In this section I will describe important configuration items for setting up our Azure Web App to host the API Server. Here is a screenshot of our Azure Web App dashboard:
![Azure Web App Dashboard](/docs/figures/azure-app-overview.png?raw=true "Azure Web App Dashboard")
</br></br>
A publish profile is a file that contains information and settings that Visual Studio uses to deploy applications and services to Azure. Here is a link to both of our configuration profiles for each of our two Web Apps:
| Web App Name | Publish Profiles (collected on 05/13/22) |
|------------|------------------------------------|
| classy-schedule-api | [classy-schedule-api.PublishSettings](/docs/config-settings/classy-schedule-api.PublishSettings) |
| classy-schedule-dev | [classy-schedule-dev.PublishSettings](/docs/config-settings/classy-schedule-dev.PublishSettings) |

### Deployment Process
To deploy the Express API Server to an Azure Web App owned by the Database team, please complete the following steps:
1. $cd classy-api
2. Install Visual Studio Code
3. Install Azure App Service extension for Visual Studio Code
4. Sign into your Azure account (Database Team members)
5. $code .
6. Select the "classy-api" folder
7. Click the "Deploy to Web App" icon and select "classy-schedule-api". Note: Please select "classy-schedule-dev" if you are deploying to developmental API server. Also, make sure to set the constant "dev" to the correct deployment type in [app.js](/classy-api/app.js).

### Network Configuration
- **DNS**: Both our Developmental API Server Web App (classy-schedule-dev) and our Production API Server Web App (classy-schedule-api) are accessible through custom DNS URLs. DNS allows us to map our Custom DNS URL onto the Azure-provided URL with a CNAME record type. To host our DNS for free, we used [noip.com](https://noip.com). To setup in Azure, we followed the guide ["Tutorial: Map an existing custom DNS name to Azure App Service"](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain?tabs=a%2Cazurecli).
- **SSL**: In order to provide connection over HTTPS through a custom DNS, we had to generate an SSL certificate and bind the certificate to the specific DNS URL within Azure Portal. We followed the guide ["Secure a custom DNS name with a TLS/SSL binding in Azure App Service"](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-bindings) to complete this process.
