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

app.config['MAX_CONTENT_LENGTH'] = 1024*1024

@app.route('/', methods=['POST', 'GET'])
def index():
    # test for POST for scrabbler:
    if request.method == 'POST' and str(request.data[:15])[4:15] == 'userLetters':
        json_body = json.loads(request.data.decode('utf-8')) # parse json
        possible_words = scrabble.find_words(json_body['board_dict'], json_body['userLetters'])
        json_response = make_response(jsonify(possible_words), 200)
        return json_response
    if True:
    # if request.method == 'POST' and str(request.data[:7])[4:7] == 'img':
        print('triggered!')
        try:
            ok_file_exts = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF']
            wrong_ext = False
            image = request.files['image']
            if image.filename != '' and image.filename.split('.')[-1] in ok_file_exts:
                img = image.read()
                base_img = imgMods.upload_img_to_base64(img)
                return render_template('index.html', image=base_img)
            else:
                wrong_ext = True
                return render_template('index.html', wrong_ext = wrong_ext)
        except Exception as e: # TODO: fix this awful exception handling!!!
            if str(e)[:3] == '413': # if 413 - Req Entity Too Large:
                return render_template('index.html', big_file=True)
            else:
                with open('./error_logs.txt', 'a') as log:
                    log.write(f'Img upload POST error @ {datetime.now()}:\n{repr(e)}\n')
        # else imgMods performs operations on the existing image:
        req = request.get_json()
        if req != None:
            return imgMods.process_request(req)
    return render_template('index.html')


@app.route('/upload-image', methods=['POST', 'GET'])
def uploadimage():
    # test for POST for mod image:
    if request.method == 'POST' and str(request.data[:7])[4:7] == 'img':
        try:
            ok_file_exts = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF']
            wrong_ext = False
            image = request.files['image']
            if image.filename != '' and image.filename.split('.')[-1] in ok_file_exts:
                img = image.read()
                base_img = imgMods.upload_img_to_base64(img)
                return render_template('upload-image.html', image=base_img)
            else:
                wrong_ext = True
                return render_template('upload-image.html', wrong_ext = wrong_ext)
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

