
from django.shortcuts import render
from rest_framework import viewsets
from django.core import serializers
from .models import Todo, Document, User, Event
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
import logging 
import uuid
import logging
import traceback
from django.core.files.base import  ContentFile
import base64 
from django.core.files.storage import default_storage
from os import listdir
from django.conf import settings 
from os.path import isfile, join
import os
import simpleaudio as sa
import tempfile
import scipy.io.wavfile
import pydub

# --------------- UTILITIES START ---------------

ALLOWED_FILE_TYPES = ['mp3', 'wav', 'aac', 'amr']

def log_exception(): 
    logging.error(traceback.format_exc())

def return_only_file_name(full_filename):
    return full_filename.split('.')[0]

def get_file_extension(file_content_type):
    return file_content_type.split("/")[1]

def return_all_files_in_dir():
    return [return_only_file_name(f) for f in listdir(settings.MEDIA_ROOT) if isfile(join(settings.MEDIA_ROOT, f))]

def return_name_with_mp3_extension(name):
    return (name +  '.' +'mp3')

def delete_file_from_directory(file_name): 
    proper_path = settings.MEDIA_ROOT + '/' + file_name
    try: 
        os.unlink(proper_path)
        return True
    except Exception as e:
        log_exception()
        return False

def convert_to_array(filename, as_float=False):
    path, extension = os.path.splitext(filename)
    proper_filename = settings.MEDIA_ROOT + filename
    # assert extension == '.mp3'
    mp3 = pydub.AudioSegment.from_file(proper_filename)
    _, path = tempfile.mkstemp()
    mp3.export(path, format='wav')
    rate, data = scipy.io.wavfile.read(path)
    try: 
        os.unlink(path) # Files at this path needs to be deleted(will do in future commits probably).
    except Exception as _:
        log_exception()

    if as_float:
        data = data/(2**15)

    return rate, data

def return_updated_name(file_name):
    if '.' in file_name: 
        return file_name
    else:
        return return_name_with_mp3_extension(file_name)

def convert_and_return_dict(file_object):
    return {
        'music_name': file_object.music_name,
        'extension': file_object.extension,
        'music_size': file_object.music_size
    }      

# --------------- UTILITIES END ---------------


# Create your views here.

@csrf_exempt
def play_song(request):
    current_filename = request.body.decode("utf-8")
    proper_path = settings.MEDIA_ROOT  + current_filename
    fetched = Document.objects.get(music_name=current_filename)
    # p = vlc.MediaPlayer(proper_path)
    # p.play()
    # print(proper_path, "222222222222222222")
    # fetched_file = Document.objects.get(music_name=current)
    # rate, data = convert_to_array(current_filename)
    # mixer.init()
    # mixer.music.load(proper_path)
    # mixer.music.play()
    return HttpResponse(status=200)

@csrf_exempt
def get_info_for_specific(request):
    file_name = request.body.decode('utf-8')
    try: 
        fetched = Document.objects.get(music_name=file_name) 
        return JsonResponse(convert_and_return_dict(fetched), safe=False)

    except Exception as e:
        log_exception()
        return HttpResponse("Error while fetching data", status=500)


@csrf_exempt
def delete_specific(request):
    to_be_deleted = request.body.decode('utf-8')
    updated_name = return_updated_name(to_be_deleted)
    if (delete_file_from_directory(updated_name)):
        try: 
            fetched = Document.objects.filter(music_name=updated_name)
            fetched.delete()
            return HttpResponse("Deleted Successfully !!!", status=200)

        except Exception as e:
            log_exception()
            return HttpResponse("Not able to delete from database !!", status=500)
    else: 
        return HttpResponse("Not able to delete file from directory!!", status=500)

@csrf_exempt
def fetch_all_users(request): 
    if request.method == "GET": 
        try: 
            all_records = User.objects.all()
            converted = []
            for record in all_records: 
                dict_object = {
                    'uuid': record.uuid,
                    'username':record.username,
                    'password': record.password,
                    'isAdmin': record.is_admin,
                    'isLoggedIn': record.is_logged_in
                 }
                converted.append(dict_object)

            return JsonResponse(converted, safe=False)
        
        except Exception as e: 
            log_exception()
            return HttpResponse("Something went wrong !!", status=500)

@csrf_exempt
def change_user_login_status(request): 
    user_uuid = request.body.decode('utf-8')
    try:
        fetched = User.objects.get(uuid=user_uuid)
        fetched.is_logged_in = False
        fetched.save()
        return HttpResponse("LogOut Successful !!", status=200)
    except Exception as e: 
        log_exception()
        return HttpResponse("Unable to logout completely!!", status=500)

@csrf_exempt 
def search(request): 
    from_frontend =  request.body.decode('utf-8')
    results = []
    try: 
        records = User.objects.filter(username__contains = from_frontend).values()
        for record in records: 
            results.append(record['username'])
        return JsonResponse({'results': list(results)})
    except Exception as e: 
        log_exception()
        return HttpResponse("There was an error while fetching the results", status=500)

@csrf_exempt
def admin_login(request): 
    from_frontend = json.loads(request.body)
    try: 
        fetched = User.objects.get(username=from_frontend['username'], password=from_frontend['password'])
        if fetched is None: 
            return HttpResponse("No user exists for the given credentials. Try again with correct credentials.", status=200)
        elif (fetched.is_admin): 
            json_response = {'uuid' : fetched.uuid, 'is_admin': fetched.is_admin}
            return JsonResponse(json_response, safe=False)       
        else: 
            return HttpResponse("The user is not an Admin !!", status=500)

    except Exception as e: 
        log_exception()
        return HttpResponse("Something went wrong, Please try again !", status=500)

@csrf_exempt
def register_user(request):
    converted = json.loads(request.body)
    try:        
        user_object = User(username=converted['username'], password=converted['password'], is_registered=True, is_logged_in=False, is_admin=converted['isAdmin'], uuid=uuid.uuid4())
        user_object.save()
        return HttpResponse("User Registered Successfully !!", status=200)
    except Exception as e: 
        log_exception()
        return HttpResponse("Not able to register user !!!", status=500)
    
    return HttpResponse(status=200)

@csrf_exempt
def process_and_upload(request):
    data = request.body
    file_from_frontend = request.FILES
    temporary_file = file_from_frontend['file'].file
    document = Document()
    for key, value in  file_from_frontend.items(): 
        file_contents = value.read()
        document.music_name = value.name 
        document.music_file =  value.read()
        document.extension = str(value).split('.')[1]
        document.is_being_played  = False
        document.uuid = uuid.uuid4()
        document.music_size = value.size
        # print(document.music_file, "-000000000000000")
    if document.extension not in ALLOWED_FILE_TYPES: 
        return  HttpResponse(status=500)
    try:
        only_files = return_all_files_in_dir() 
        file_fullname = document.music_name
        if return_only_file_name(file_fullname) in only_files:
            return HttpResponse("The file is already uploaded", status= 200)

        else: 
            file_data = ContentFile(base64.b64decode(file_contents))
            file_name = default_storage.save(document.music_name, file_data)
            document.save()
            return HttpResponse("File Uploaded Successfully", status=200)

    except Exception as e: 
        log_exception()
        return HttpResponse(status=500)

@csrf_exempt
def all_files(request):
    try:
        all_files = Document.objects.all()
        return JsonResponse([record.music_name for record in all_files], safe=False)
    except Exception as e:
        log_exception()
        return HttpResponse(status=500)

@csrf_exempt
def update_user_profile(request):
    from_frontend = json.loads(request.body)
    try: 
        fetched = User.objects.get(uuid=from_frontend['uuid'])
        fetched.username = from_frontend['username']
        fetched.password = from_frontend['password']
        fetched.is_admin = from_frontend['isAdmin']
        fetched.save()
        return HttpResponse("Update Operation Successful !!!", status=200)

    except Exception as e:
        log_exception()
        return HttpResponse(status=500) 


@csrf_exempt
def fetch_user(request): 
    user_uuid = request.body.decode('utf-8')
    try: 
        fetched = User.objects.get(uuid=user_uuid)
        converted_dict = {
            'uuid': user_uuid,
            'username': fetched.username,
            'password': fetched.password,
            'isAdmin': fetched.is_admin
            }

        return JsonResponse(converted_dict, safe=False)

    except Exception as e: 
        log_exception()
        return HttpResponse("There was some error while trying to fetch data !!!", status=500)


@csrf_exempt
def create_todo(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try: 
            todo_object = Todo(title=data["title"], description=data["description"], completed=data["completed"] )
            todo_object.save()
            return HttpResponse("True", status=200)
        except Exception as e: 
            log_exception()
            return HttpResponse("False", status=500)
    


def todo_view(request): 
    serializer_class = TodoSerializer
    records  = Todo.objects.all().values()
    return JsonResponse(list(records), safe=False)

@csrf_exempt
def load_seed_data(request):     
    jimmy = {
    'uuid': uuid.uuid4(),
    'username': "Jimmy",
    'password': "jimmy",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    harry = {
    'uuid': uuid.uuid4(),
    'username': "Harry",
    'password': "harry",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    john = {
    'uuid': uuid.uuid4(),
    'username': "johnwick",
    'password': "johnwick",
    'is_admin': True,
    'is_registered': True,
    'is_logged_in': False
    }

    ethan = {
    'uuid': uuid.uuid4(),
    'username': "Ethan",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    rajesh = {
    'uuid': uuid.uuid4(),
    'username': "Rajesh",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    shubham = {
    'uuid': uuid.uuid4(),
    'username': "Shubham",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    vikrant = {
    'uuid': uuid.uuid4(),
    'username': "Vicky69",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    mandeep = {
    'uuid': uuid.uuid4(),
    'username': "man-deep",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    sam = {
    'uuid': uuid.uuid4(),
    'username': "Sammy Mammy Zayn",
    'password': "password",
    'is_admin': False,
    'is_registered': True,
    'is_logged_in': False
    }

    kuuk_aanaa = {
    'uuid': uuid.uuid4(),
    'username': "angle_69",
    'password': "password",
    'is_admin': True,
    'is_registered': True,
    'is_logged_in': False
    }

    cock_sesnar = {
    'uuid': uuid.uuid4(),
    'username': "cocksesnar",
    'password': "password",
    'is_admin': True,
    'is_registered': True,
    'is_logged_in': False
    }
    try: 
        for user in [jimmy, harry, john, ethan, rajesh, shubham, vikrant, mandeep, sam, kuuk_aanaa, cock_sesnar]: 
            user_object = User(uuid=user['uuid'], username=user['username'], password=user['password'], is_admin=user['is_admin'], is_registered=user['is_registered'], is_logged_in=user['is_logged_in'])
            user_object.save()
        return HttpResponse("Seed Data created successfully !!", status=200)

    except Exception as e: 
        logging.error(traceback.format_exc())
        return HttpResponse("There was some problem while loading the seed data" ,status=500)

def get_all_events(request): 
    records  = Event.objects.all()
    names = []
    for record in records:     
        names.append(record.name)
    return JsonResponse(names, safe=False)