# Classy-Schedule Database Team

## Product Overview
Welcome to the Database Team's GitHub repository. Our final product delivered to the client is an information storage and retrieval system represented by the integration of a database component and an API component. The database component of the final product contains all the information needed to build a school-wide academic schedule for a given semester. The API component we developed is an Express-based API to serve as a layer of abstraction between our MySQL database and the other development teams. 
</br></br>
**For information regarding database setup, maintenance, and hosting, please see the [/classy-db](/classy-db) subdirectory.**</br>
**For information regarding API setup, development, and deployment, please see the [/classy-api](/classy-api) subdirectory.**

## Quickstart Guide
If the semester is still in progress and our cloud services (Azure MySQL database and Azure Web App) are still accessible, we recommend that you follow the [quickstart guide](/classy-api#api-quickstart) located in our [/classy-api](/classy-api) subdirectory. This will include information about setting up an account, logging in, and using different components of our final product. 

## Classy-Schedule API Access
Production API access: https://classy-api.ddns.net (please see [docs/versioning.md](docs/versioning.md) for version connection info.)
</br>
Developmental API access: https://classy-dev.ddns.net (only for Database Team development)

## Network Structure
Shown below, we show how our Production API Server can serve as a layer of abstraction between our MySQL database and the other development teams.
![Alt text](docs/figures/network-layout.png?raw=true "Network Layout")
