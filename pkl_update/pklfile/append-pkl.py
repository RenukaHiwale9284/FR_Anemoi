import numpy as np
from matplotlib import pyplot as plt
import cv2
import scipy
from scipy.spatial import distance
import os
from os import listdir
from os.path import isfile, join

import keras
from keras.models import Model, Sequential
from keras.layers import Input, Conv2D, MaxPooling2D, Flatten,Dense,GlobalAveragePooling2D,Lambda,add, Dropout, Activation,Concatenate,BatchNormalization
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array
from keras.applications.imagenet_utils import preprocess_input
from keras.preprocessing import image
from keras import backend as K
import pickle


import mtcnn
from mtcnn.mtcnn import MTCNN
model2 = MTCNN(min_face_size = 10)
from inception_resnet_v1 import *
model = InceptionResNetV1()
model.load_weights('facenet_weights.h5')





# azure cloude file access 


from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
# from azure.storage.blob import BlobServiceClient

connection_string = "DefaultEndpointsProtocol=https;AccountName=doorlockblobstorage;AccountKey=5KjHGkpRfp18caTpe37kORiGxazGIEX20JB9Mutkgu77Bp9rCw57HEqrgXvsyuyoC9eyQROJdW0a+AStcM7NNw==;EndpointSuffix=core.windows.net"
container_name = "doorlockblobcontainer"
blob_name = "Anemoi_face.pkl"
# blob_service = BlobServiceClient(account_name='doorlockblobstorage',blob_name = 'Anemoi_face.pkl', account_key='YiF5Qb+Tv0FdGwZjiqlcnbcgQ5A53cY79Lfw3gca9Z27Z6dQWXehRy/UOHO5F0OyaCl0DQCjBNZK+AStfR0EYQ==')
# blob_data = blob_service.get_blob_to_text(container_name='doorlockblobcontainer', blob_name='Anemoi_face.pkl')

# import pickle
# all_people_faces = pickle.loads(blob_data.content)

blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(blob_name)

# # Download the blob as bytes
blob_bytes = blob_client.download_blob().readall()
# Load the PKL file from the bytes
import pickle
all_people_faces= pickle.loads(blob_bytes)

# print(all_people_faces)
# for i in all_people_faces.items():
#     print(i[0])
# blob_client.upload_blob(all_people_faces)
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
    person_image1 = cv2.imread(image)
    person_image = cv2.cvtColor(person_image1, cv2.COLOR_BGR2RGB)
    face_info = model2.detect_faces(person_image)
    for face in face_info:
        if face['confidence']>0.92:
            x,y,w,h = face['box']
            x,y = abs(x),abs(y)
            face = person_image1[y-margin//2:y+h+margin//2,x-margin//2:x+w+margin//2,:]
            roi = cv2.resize(face, (160,160))
            break
        else:
            pass
    return roi

Anemoi_people_faces = {}
l1={}
def add_photo(image_path,name):
    #name1 = str(input('Enter the name of person'))
    #number = int(input('Enter the sr. number '))
    
    
    number = 1
    im = faceinfo(image_path)
    cv2.imwrite('Crop_Faces/'+name+ str(number) + '.jpg',im)
    im2 = np.expand_dims(im, axis=0)
    im3 = l2_normalize(model.predict(preprocess(im2)))
    # print(im3)
    # Anemoi_people_faces[name + str(number)] = im3
    
    l1[name+str(number)]=im3
    
    
    # l1=np.array(im3)
    

    #print('Done')
path = "D:\\python_detection_models\\facerecognationV\\Visitor_registration\\face_id1"
dir_list = os.listdir(path)
 
# prints all files
#print(dir_list)

li=[x.split('.')[0] for x in dir_list]
print(li)

for name in li:
    image_path = "D:\\python_detection_models\\facerecognationV\\Visitor_registration\\face_id1\\"+name+".jpg"
    add_photo(image_path, name)

# local pkl file data
# Anemoi_people_faces = pickle.load(open('anemoi_face.pkl','rb'))
# print(Anemoi_people_faces)


#acess data from azure pkl file
l=[]
Anemoi_people_faces= pickle.loads(blob_bytes)
for i in Anemoi_people_faces.items():
    l.append(i[0])
for j in l:

    # for j in range(0,len(Anemoi_people_faces)):
    # if i==Anemoi_people_faces.items():
    

    # access blob containde file data
    for i  in l1:
        if i==j:
            pass
        else:
            Anemoi_people_faces[i]=np.array(l1[i],np.float32)
            print(Anemoi_people_faces)
            
            
print(Anemoi_people_faces)

# with open('Anemoi_face.pkl', 'wb') as f:
#     pickle.dump(Anemoi_people_faces, f, pickle.HIGHEST_PROTOCOL)
# with open('Anemoi_face.pkl', 'rb') as f:
#     blob_client.upload_blob(f,overwrite=True)
