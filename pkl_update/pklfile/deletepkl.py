import pickle
def delete():
    emp_id = int(input("Enter id to be deleted: "))
    records = []
    with open('Anemoi_face.pkl','rb') as stream:
        while True:
            try:
                record = pickle.load(stream)
                # print(record[str(emp_id)])
                # print(record)
                for rec in record:
                    print(rec)
                record.pop(str(emp_id))
                # if record!=record[str(emp_id)].all():
                records.append(record)
            except EOFError:
                break
    
    # records now contains all students, except for the one we want to delete
    with open("Anemoi_face.pkl","wb") as stream:
        for record in records:
            print(record)
            pickle.dump(record, stream)
delete()