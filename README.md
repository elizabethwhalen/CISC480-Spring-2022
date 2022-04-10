# CISC480-Spring-2022

api url: "http://databaseconnectionexample.azurewebsites.net"
curl commands for accessing api:

*** CURRENT API CURL COMMANDS ***


VIEW: `curl "http://databaseconnectionexample.azurewebsites.net/[table]"`
ADD: `curl "http://databaseconnectionexample.azurewebsites.net/[table]" -X POST -d "table_attribute1=value&table_attribute2=value"`
UPDATE: out of order
DELETE: `curl "http://databaseconnectionexample.azurewebsites.net/[table]?table_primary_key1=value&table_primarykey2=value" -X DELETE`


Examples for class table:

VIEW ALL CLASSES: `curl "http://databaseconnectionexample.azurewebsites.net/class"`
ADD CISC 975: `curl "http://databaseconnectionexample.azurewebsites.net/class" -X POST -d "dept_code=CISC&class_num=975&class_name=Example+Class"`
DELETE CISC 976: `curl "http://databaseconnectionexample.azurewebsites.net/class?dept_code=CISC&class_num=976" -X DELETE`



*** FUTURE API CURL COMMANDS ***


VIEW: `curl "http://databaseconnectionexample.azurewebsites.net/[table]"`
ADD: `curl "http://databaseconnectionexample.azurewebsites.net/[table]" -X POST -d "table_attribute1=value&table_attribute2=value"`
UPDATE: `curl "http://databaseconnectionexample.azurewebsites.net/[table]/table_primarykey1/table_primarykey2/..." -X PUT -d "table_attribute1=value&table_attribute2=value"`
DELETE: `curl "http://databaseconnectionexample.azurewebsites.net/[table]/table_primarykey1/table_primarykey2/..." -X DELETE`


Examples for class table:

VIEW ALL CLASSES: `curl "http://databaseconnectionexample.azurewebsites.net/class"`
ADD CISC 975: `curl "http://databaseconnectionexample.azurewebsites.net/class" -X POST -d "dept_code=CISC&class_num=975&class_name=Example+Class"`
UPDATE CISC 975 to CISC 976: `curl "http://databaseconnectionexample.azurewebsites.net/class/CISC/480" -X PUT -d "class_num=976"`
DELETE CISC 976: `curl "http://databaseconnectionexample.azurewebsites.net/class/CISC/976" -X DELETE`
