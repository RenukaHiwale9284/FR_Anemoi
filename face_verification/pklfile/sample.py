
import pymongo
import numpy as np
import json
import re
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['face']
mydb = db["attendance"]
for x in mydb.find({},{"_id":0}):
    print("id:-",x['username'])
    import re
    # a = np.asarray(json.loads(re.sub(" ", ",", x['data'])))
    a=json.dumps(x['data'])
    re.sub('\s+',' ', a)
 
    # a=a.replace(" ",",")
    # a=a.replace(",",",,")
    a=json.loads(a)
    # a = np.asarray(a,dtype=np.float32)
    print("data:-", a)