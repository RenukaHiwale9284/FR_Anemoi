# import pickle
import pymongo
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['face']
table1= db['attendance']
def delete(emp_id ):
    # print(str(emp_id))
    try:
        user = table1.find_one({"username":str(emp_id)})
            # print(i['username'])
        if user:
            table1.delete_one( {"username":str(emp_id)})
        else:
            print("Enter id is not in database")

    except Exception as e:
        print(e)
   
emp_id = int(input("Enter id to be deleted: "))
delete(emp_id )