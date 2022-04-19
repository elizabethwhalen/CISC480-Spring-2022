**API v3 Changes**

All query_db functions made asynchronous, and each method is being updated to use async/await format as they are changed. A list of all changes is included below.

Entries formatted: [table] -X [method]: [change made]

**CHANGES MADE**

class -X POST: a new body option is added. When req.body.features has content, the method will check if the feature exists, and add it to the feature table it it does not. It then adds an entry to the class_feature table with the keys for the class and the feature.


**TODO** (everyone- feel free to add things here, just include your name so we can follow up with any questions. formatting as aboove if appreciated but not required)


