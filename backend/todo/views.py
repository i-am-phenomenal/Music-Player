from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo, Document
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

# --------------- UTILITIES END ---------------


# Create your views here.



@csrf_exempt
def process_and_upload(request):
    data = request.body
    file_from_frontend = request.FILES
    document = Document()
    for key, value in  file_from_frontend.items(): 
        document.music_file = value.read()
        document.music_name = value.name 
        document.extension = get_file_extension(value.content_type)
        document.is_being_played  = False
        document.uuid = uuid.uuid4()
        document.music_size = value.size


    if document.extension not in ALLOWED_FILE_TYPES: 
        return  HttpResponse(status=500)

    try:
        only_files = return_all_files_in_dir() 
        file_fullname = document.music_name
        if return_only_file_name(file_fullname) in only_files:
            return HttpResponse("The file is already uploaded", status= 200)

        else: 
            file_data = ContentFile(base64.b64decode(document.music_file))
            file_name = default_storage.save(document.music_name, file_data)
            return HttpResponse("File Uploaded Successfully", status=200)

    except Exception as e: 
        log_exception()
        return HttpResponse(status=500)

@csrf_exempt
def all_files(request):
    try:
        all_files = return_all_files_in_dir()
        converted = json.dumps(all_files)
        return HttpResponse(converted, content_type='application/json', status=200)
    except Exception as e:
        log_exception()
        return HttpResponse(status=500)


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