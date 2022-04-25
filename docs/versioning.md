**Tables and Attributes**

**building: building_code**, building_name

**class: _dept_code_, class_num**

**class_feature: _dept_code, class_num, feature_id_**

**dept: dept_code**, dept_name

**faculty: faculty_id**, faculty_first, faculty_last, _title_id_, prev_load, curr_load

**faculty_class: _faculty_id, dept_code, class_num_**

**faculty_feature: _faculty_id, feature_id_**

**faculty_other_request: _faculty_id_, request**

**faculty_timeslot: _faculty_id, time_id_**, pref_level

**feature: _feature_id, feature_name_**

**login: user_id**, pass, faculty_id, access_level

**meets: _dept_code, class_num, section_num, semester, draft, building_code, room_num, time_id_**

**room: _building code_, room_num**, capacity

**room_feature: _building_code, room_num, feature_id_**

**section: _dept_code, class_num_, section_num, semester, draft**, capacity

**teaches: _dept_code, class_num, section_num, semester, draft, faculty_id_**

**timeslot: time_id**, day_of_week, time_start, time_end

**title: title_id**, title_name, max_load

All tables support the following methods*:

**v0:**

View records in table: `curl "https://classy-api.ddns.net/class"`

Add new record to table: `curl "https://classy-api.ddns.net/class" -X POST -d "dept_code=OSS&class_num=999"`

**v2:**

View records in table: `curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/class" -X GET`

View records (filtered) in table: `curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/class?dept_code=CISC" -X GET`

Add new record to table: `curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/class" -X POST -d "dept_code=OSS&class_num=999"`

Update record in table: `curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/class/OSS/999" -X PUT -d "class_name="example"`

Delete record in table: `curl -H "Authorization: Bearer [token]" "https://classy-api.ddns.net/v2/class/OSS/999" -X DELETE`

_*login does not fit pattern- the v2 add method is disabled in lieu of the login method shown below_

**Login and Security**

HTTP was disabled on 4/24/2022. All requests must be made over HTTPS now.

All methods in v2 and up require token authorization to access. 

Login accounts are created via the signup method (`curl "https://classy-api.ddns.net/v2/signup" -X POST -d "username=[username]&password=[password]"`)

Tokens are obtained via the login method (`curl "https://classy-api.ddns.net/v2/login" -X POST -d "username=[username]&password=[password]"`)

Once the token is acquired, it must be included in the the header after each curl command. In v2, all accounts have full access to all methods. In versions 3 and up, methods will be restricted depending on the access_level and faculty_id associated with login accounts.
