import numpy as np
from matplotlib import pyplot as plt
import cv2
import scipy
from scipy.spatial import distance
import os
from os import listdir
from os.path import isfile, join
import json
import keras
from keras.models import Model, Sequential
from keras.layers import Input, Conv2D, MaxPooling2D, Flatten,Dense,GlobalAveragePooling2D,Lambda,add, Dropout, Activation,Concatenate,BatchNormalization
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array
from keras.applications.imagenet_utils import preprocess_input
from keras.preprocessing import image
from keras import backend as K
import pickle
import time
import base64
from PIL import Image
import io
import pymongo
# client1 = pymongo.MongoClient('mongodb://192.168.1.2:27017/')
from pymongo import MongoClient

# client2 = MongoClient('mongodb://192.168.1.2:27017/') 

# db = client2['AttendanceNew']
# table2 = db['registrations']
client = pymongo.MongoClient('mongodb://localhost:27017/')
# db = client['face']
# table1= db['attendance']
db1 = client['AttendanceNew']
table2=db1['registrations']
table1=db1['imagedata']
import mtcnn
from mtcnn.mtcnn import MTCNN
model2 = MTCNN(min_face_size = 10)
from inception_resnet_v1 import *
model = InceptionResNetV1()
model.load_weights('facenet_weights.h5')

# from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
# # from azure.storage.blob import BlobServiceClient

# connection_string = "DefaultEndpointsProtocol=https;AccountName=doorlockblobstorage;AccountKey=5KjHGkpRfp18caTpe37kORiGxazGIEX20JB9Mutkgu77Bp9rCw57HEqrgXvsyuyoC9eyQROJdW0a+AStcM7NNw==;EndpointSuffix=core.windows.net"
# container_name = "doorlockblobcontainer"
# blob_name = "Anemoi_face.pkl"
# blob_service_client = BlobServiceClient.from_connection_string(connection_string)
# container_client = blob_service_client.get_container_client(container_name)
# blob_client = container_client.get_blob_client(blob_name)

# blob_bytes = blob_client.download_blob().readall()

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


def faceinfo(image,margin =10):
    global roi
    # person_image1 = cv2.imread(image)
    # person_image = cv2.cvtColor(person_image1, cv2.COLOR_BGR2RGB)
    # person_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_np = np.array(image)
    # person_image = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    # person_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    # person_image=cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    # cv2.cvtColor(im_cv, cv2.COLOR_BGR2RGB)
    face_info = model2.detect_faces(image_np)
    for face in face_info:
        if face['confidence']>0.92:
            x,y,w,h = face['box']
            x,y = abs(x),abs(y)
            face = image_np[y-margin//2:y+h+margin//2,x-margin//2:x+w+margin//2,:]
            roi = cv2.resize(face, (160,160))
            break
        else:
            pass
    return roi

Anemoi_people_faces = {}

def add_photo(image_path,name):
    #name1 = str(input('Enter the name of person'))
    #number = int(input('Enter the sr. number '))
    
    image_path=cv2.cvtColor(image_path, cv2.COLOR_BGR2RGB)
    
    im = faceinfo(image_path)
    cv2.imwrite('Crop_Faces/'+name+ '.jpg',im)
    im2 = np.expand_dims(im, axis=0)
    im3 = l2_normalize(model.predict(preprocess(im2)))
    # print(im3)
    ab=np.array(im3[0], dtype=np.float32)
    document = {"username": name,"data":str(ab)}
    # print(document)
    # print('code',name)
    user = table1.find_one({"username":name})
    if user:
        print("user is already registered in system")
    else:
        table1.insert_one(document)




    # Anemoi_people_faces[name + str(number)] = im3
    #print('Done')
# path = "E:\\attaendance\\pkl_update\\database\\face_id1\\"
# dir_list = os.listdir(path)


# li=[x.split('.')[0] for x in dir_list]
# print(li)

# for name in li:
#     image_path = "E:\\attaendance\\pkl_update\\database\\face_id1\\"+name+".jpg"
#     add_photo(image_path, name)



def stringToRGB(base64_string):
    try:
        # Decode the base64 string to bytes
        # image_data = base64.b64decode(base64_string)

        # Convert bytes to an in-memory binary stream
        # image_stream = io.BytesIO(image_data)

        # Open the image stream with PIL.Image
        # image = Image.open(image_stream)
        # image = bytes.fromhex(str(base64_string))
        image1 = Image.open(io.BytesIO(base64_string))
        if isinstance(image1, Image.Image):
            image_np = np.array(image1)
        else:
            # Convert bytes to numpy array
            image_np = np.frombuffer(image1, dtype=np.uint8)
    
        # Ensure that the image is in RGB format if needed
        if len(image_np.shape) == 2:
            # Grayscale image, convert to RGB
            image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2RGB)
        elif len(image_np.shape) == 3 and image_np.shape[2] == 4:
            # RGBA image, convert to RGB
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)

        return image_np
    except Exception as e:
        print("Error decoding image:", e)
        return None

# Your existing code with modifications
cursor = table2.find()
for rec in cursor:
    empid = rec['empid']
    print(empid)
    f = rec['file']
    # print(type(f['data']))
    image1 = stringToRGB(f['data'])
    # add_photo(image1, empid)
    # # img = detector.findHands(image1)
     
    # if image1:
    add_photo(image1, empid)
        # Convert PIL Image to numpy array
        # if isinstance(image1, Image.Image):
        #     image_np = np.array(image1)
        # else:
        #     # Convert bytes to numpy array
        #     image_np = np.frombuffer(image1, dtype=np.uint8)
    
        # # Ensure that the image is in RGB format if needed
        # if len(image_np.shape) == 2:
        #     # Grayscale image, convert to RGB
        #     image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2RGB)
        # elif len(image_np.shape) == 3 and image_np.shape[2] == 4:
        #     # RGBA image, convert to RGB
        #     image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)

        # Display the image using OpenCV
    cv2.imshow("AI", image1)
    cv2.waitKey(1)
    cv2.destroyAllWindows()
    
    # # time.sleep(5)
    # print(f['data'])
    # image = base64.b64decode(Image.open(io.BytesIO(f['data'])))
    # image.show()
    # print(f)
    # f=f['data']
    # print(f)
    # img = Image.open(f)
    # print(img.size)
    # img.show()

# imgdata = base64.b64decode(imgstring)
# filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
# with open(filename, 'wb') as f:
#     f.write(imgdata)
#     with open('Anemoi_face1' + '.pkl', 'wb') as f:
#         pickle.dump(Anemoi_people_faces, f, pickle.HIGHEST_PROTOCOL)
    
#     Anemoi_people_faces = pickle.load(open('anemoi_face1.pkl','rb'))
# print(Anemoi_people_faces)
# with open('Anemoi_face.pkl', 'rb') as f:
#     blob_client.upload_blob(f,overwrite=True)