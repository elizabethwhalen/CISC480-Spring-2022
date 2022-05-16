All new accounts have an access level of zero. Follow these steps to change your access level.

1. Create a new account: ```curl "https://classy-api.ddns.net/v2/signup" -X POST -d "email=[youremail@stthomas.edu]&password=[yourpassword]"```
2. Login to the developer account: ```curl "https://classy-api.ddns.net/v2/login" -X POST -d "email=classy-schedule-dev@stthomas.edu&password=classyschedule"```
3. Copy the returned token and use it for the next request
3. Update your account access_level: ```curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/login/[youremail@stthomas.edu]" -X PUT -d "access_level=2"```
4. Login to your account: ```curl "https://classy-api.ddns.net/v2/login" -X POST -d "email=[youremail@stthomas.edu]&password=[yourpassword]"```
5. Copy your token and use it for your requests

You can check your access_level by copying and pasting your token into the textbox at this url: jwt.io