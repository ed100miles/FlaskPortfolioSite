from werkzeug.wrappers import response
from app import app
from flask import render_template, request, redirect, jsonify, make_response
import cv2 
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from app import imgMods
from trie import scrabble
import json
from datetime import datetime
import pandas as pd
import data_pipe as pipe
import pickle

app.config['MAX_CONTENT_LENGTH'] = 1024*1024

with open('app/pickles/ada76.pickle', 'rb') as file:
    ada = pickle.load(file)

@app.route('/', methods=['POST', 'GET'])
def index():
    # test if POST for scrabbler:
    if (
        request.method == 'POST' and 
        str(request.data[:15])[4:15] == 'userLetters'
        ):
        
        json_body = json.loads(request.data.decode('utf-8')) # parse json
        possible_words = scrabble.find_words(
            json_body['board_dict'], 
            json_body['userLetters'])
        json_response = make_response(jsonify(possible_words), 200)
        return json_response
    
    req = request.get_json()
    
    if req != None:
        return imgMods.process_request(req)
    
    # if POST request contains an image to upload:
    if request.method == 'POST' and request.files['image']:
        try:
            ok_file_exts = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 
                            'JPEG', 'PNG', 'GIF']
            image = request.files['image']

            if (
                image.filename != '' and
                image.filename.split('.')[-1] in ok_file_exts
            ):
                img = image.read()
                base_img = imgMods.upload_img_to_base64(img)
                
                return render_template(
                    'index.html', 
                    image=base_img, 
                    scrollToMod=True)
            else:
                return render_template(
                    'index.html', 
                    wrong_ext = True, 
                    scrollToMod=True)
        except Exception as e: # TODO: fix this awful exception handling!!!
            if str(e)[:3] == '413': # if 413 - Req Entity Too Large:
                return render_template(
                    'index.html', 
                    big_file=True, 
                    scrollToMod=True)
            else:
                with open('./error_logs.txt', 'a') as log:
                    log.write(
                        f'Img upload POST error @'
                        f' {datetime.now()}:\n{repr(e)}\n')
    
    return render_template('index.html')


@app.route('/upload-image', methods=['POST', 'GET'])
def uploadimage():
    # test for POST for mod image:
    if request.method == 'POST' and request.files['image']:
        try:
            ok_file_exts = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF']
            image = request.files['image']
            if image.filename != '' and image.filename.split('.')[-1] in ok_file_exts:
                img = image.read()
                base_img = imgMods.upload_img_to_base64(img)
                return render_template('upload-image.html', image=base_img)
            else:
                return render_template('upload-image.html', wrong_ext = True)
        except Exception as e: # TODO: fix this awful exception handling!!!
            if str(e)[:3] == '413': # if 413 - Req Entity Too Large:
                return render_template('upload-image.html', big_file=True)
            else:
                with open('./error_logs.txt', 'a') as log:
                    log.write(f'Img upload POST error @ {datetime.now()}:\n{repr(e)}\n')
        # else imgMods performs operations on the existing image:
        req = request.get_json()
        if req != None:
            return imgMods.process_request(req)
    return render_template('upload-image.html')

@app.route('/underwriter', methods=['POST'])
def underwriter():
    if request.method == 'POST':
        json_body = json.loads(request.data.decode('utf-8')) # parse json
        json_df = pd.DataFrame(json_body, index=[1])

        empty_df = pipe.empty_df
        trans_json_df = pipe.data_pipeline.transform(json_df)

        app_df = empty_df.append(trans_json_df)
        app_df = app_df.fillna(0)
        predict_df = app_df.iloc[-1:]

        # print(predict_df)

        # risk = round((ada.predict_proba(predict_df.to_numpy())[0][1] - 0.48) * 6500 / 3, 2)
        risk = ada.predict_proba(predict_df.to_numpy())[0][1]
        redness = 255 
        greenness = 255
        response = (risk, redness, greenness)

        json_response = make_response(jsonify(response), 200)
        return json_response
        
        
        
        # df = pipe.train_set.copy()
        # json_body_modified = {}
        # for key, val in json_body.items():
        #     try:
        #         for column in df.columns:
        #             try:
        #                 _ = json_body[column]
        #                 json_body_modified[key] = float(val)
        #             except:
        #                 json_body_modified[column] = 0.0
        #     except:
        #         pass


        # json_df = pd.DataFrame(json_body_modified, index=[1])
        
        # print(len(json_body_modified))
        # print(json_body_modified)

        # json_df = pipe.data_pipeline.transform(json_df)


        # print(set(df.columns).symmetric_difference(set(json_df.columns)))

        # for column in json_df.columns:
        #     try:
        #         json_df[column] = json_df[column].astype('float64')
        #     except Exception as e:
        #         print(e)
    

        # for column in json_df.columns:
        #     df[column] = json_df[column].astype('float64')

        # df = pipe.data_pipeline.transform(df)

        # print(df.info())
        # print(ada.predict(json_df))


