import cv2 
import pickle
import numpy as np
from inception_resnet_v1 import *

from scipy.spatial import distance
import psycopg2
import random
from datetime import datetime
import requests
import time
APIKey="adbd4d1b-87dc-4984-8a4b-2add2cdfc83c"

# APIKey="0cddb556-0bec-11ed-861d-0242ac120002"
#Device address
# DeviceAddress=127
DeviceAddress=1107
# ReaderNumber=random.randint(1,4)
ReaderNumber=1
dt_obj= datetime.now()



all_people_faces = pickle.load(open('E:\\attaendance\\pkl_update\\pklfile\Anemoi_face1.pkl','rb'))

rtsp='rtsp://192.168.0.100:554/user=admin&password=admin123&channel=1&stream=0.sdp'
# rtsp='rtsp://admin:123456@192.168.1.216/H264?ch=1&subtype=0
cap = cv2.VideoCapture(rtsp)

detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
model = InceptionResNetV1()
model.load_weights('E:\\attaendance\\face_verification\\pklfile\\facenet_weights.h5')

def l2_normalize(x, axis=-1, epsilon=1e-10):
    output = x / np.sqrt(np.maximum(np.sum(np.square(x), axis=axis, keepdims=True), epsilon))
    return output

def preprocess(x):
    if x.ndim == 4:
        axis = (1, 2, 3)
        size = x[0].size
    elif x.ndim == 3:
        axis = (0, 1, 2)
        size = x.size
    else:
        raise ValueError('Dimension should be 3 or 4')

    mean = np.mean(x, axis=axis, keepdims=True)
    std = np.std(x, axis=axis, keepdims=True)
    std_adj = np.maximum(std, 1.0/np.sqrt(size))
    y = (x - mean) / std_adj
    return y


while(True):
    try:
        ret,frame = cap.read()
        dt_obj= datetime.now()
        if not frame.any():
            print("Error: Input image is empty.")
        else:
            image = cv2.resize(frame, (0, 0), fx=0.7, fy=0.5, interpolation=cv2.INTER_AREA)
        
        # image = frame
        # image = cv2.resize(image,(640,480))
        # image = cv2.resize(frame, (0, 0), fx=0.7, fy=0.5, interpolation=cv2.INTER_AREA)
        # image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        faces = detector.detectMultiScale(image, scaleFactor=1.3, minNeighbors=5)
        
        for (x, y, w, h) in faces:
            roi = image[y:y + h, x:x + w]
            roi =  cv2.resize(roi, (160,160))
            roi = np.expand_dims(roi, axis=0)
            captured_representation = l2_normalize(model.predict(preprocess(roi))[0])
            #cv2.rectangle(image,(x1,y1-20),(x2+40,y1),(0,255,0),-4)
            sim_dict = {}
            global empid
            list=['2']
            for i in all_people_faces:
                person_name = i
                representation = all_people_faces[i]
                # print("file",representation)
                # print("catch",captured_representation)
                representation = representation.flatten()
                captured_representation = captured_representation.flatten()
                similarity =  distance.euclidean(representation, captured_representation)
                sim_dict[person_name] = similarity
                min_similarity = min(sim_dict.values())
            found = 0
            if min_similarity < 0.8:
                person_name1 = [key for key in sim_dict if sim_dict[key] == min_similarity]
                cv2.rectangle(image, (x, y-40), (x+w, y+h+10), (0, 255, 0), 2)
                cv2.putText(image, person_name1[0][:], (int(x), int(y-5)), 2, 2, (0, 0, 255), 4)
                empid=person_name1[0][:]
                list.append(empid)
                
                
                # detected_list.append(person_name1[0][:-1])
                found = 1
            if(found == 0):
                cv2.rectangle(image, (x, y-40), (x+w, y+h+10), (0, 255, 0), 2)
                cv2.putText(image, ' ', (int(x), int(y-5)), 2, 2, (0, 255, 0), 4)
                empid=19231
                list.append(empid)
            print('data',empid)
            # person=str(empid)
            # api=str(APIKey)
            # if list[0]!=empid:
            # conn = psycopg2.connect(dbname='Pwc_Leela', user='postgres', password='admin',host='localhost',port=5433)
            # cur = conn.cursor()
            # create employ basic detel
            # cur.execute("CREATE TABLE EMP_Data1(id SERIAL PRIMARY KEY, Emp_Id VARCHAR,Emp_name VARCHAR);")
            # conn.commit()
            #extract name of person by database use with Emp_id
            # cur.execute("SELECT emp_name FROM emp_data WHERE Emp_id LIKE '%s'"%(empid))
            # Emp_name=cur.fetchone()
            
            #create table for emp details
            # cur.execute("CREATE TABLE EMP_Detected_Data1(id SERIAL PRIMARY KEY, Emp_Id VARCHAR,Emp_name VARCHAR, Device_id INT,Reader_No INT,API_Key VARCHAR,Date_Time VARCHAR);")
            
            
            # insert data of employ Exepect Unkonwne persone
            # if empid!=19231:
            #     cur.execute("INSERT INTO EMP_Detected_Data(Emp_Id, Emp_name,Device_id, Reader_No, API_Key, Date_Time) VALUES(%s,%s,%s,%s,%s,%s)",(empid,Emp_name,DeviceAddress,ReaderNumber,APIKey,dt_obj))
            #     conn.commit()
            # time.sleep(5)
            # if empid!=19231:
            #     response = requests.post('http://10.90.138.164:8081/TPIAuthentication',json={"PersonCode":person,"DeviceAddress":DeviceAddress,"ReaderNumber":ReaderNumber,"APIKey":api})
            #     print(response.json())

            

        cv2.imshow("livepkl",image)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    except Exception as e:
        print(e)
cap.release()
cv2.destroyAllWindows()