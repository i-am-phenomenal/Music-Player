from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo, Document
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
import logging
import numpy as np 
import uuid
import logging
import traceback

# --------------- UTILITIES START ---------------

ALLOWED_FILE_TYPES = ['mp3', 'wav', 'aac', 'amr']

def log_exception(): 
    logging.error(traceback.format_exc())

def get_file_extension(file_content_type):
    return file_content_type.split("/")[1]

# --------------- UTILITIES END ---------------


# Create your views here.



@csrf_exempt
def process_and_upload(request):
    data = request.body
    file_from_frontend = request.FILES
    file_body = b''
    document = Document()
    for key, value in  file_from_frontend.items():
        file_body = value.read()
        document.music_file = file_from_frontend
        document.music_name = value.name 
        document.extension = get_file_extension(value.content_type)
        document.is_being_played  = False
        document.uuid = uuid.uuid4()
        document.music_size = value.size
        # print(key, value, "2222222222")
        print(type(value), "333333333333")
        print(type(value.read()), "@@@@@@@@@@@@@@@@")
        print(value.name)
        print(value.size)
        print(value.content_type)

# PROBLEM WITH THE FILE FROM FRONTEND .  CANT SEND THIS VALUE WHILE CREATING DOCUMENT DATA
    if document.extension not in ALLOWED_FILE_TYPES: 
        return  HttpResponse(status=500)

    try:
        object, created = Document.objects.get_or_create(music_file=file_from_frontend, music_name= document.music_name, extension = document.extension, is_being_played=False, uuid=uuid.uuid4(), music_size=document.music_size)
        if created:
            return HttpResponse("File Uploaded Successfully", status=200)
        else: 
            return HttpResponse("File was already uploaded", status=200)
    except Exception as e: 
        log_exception()
        return HttpResponse(status=500)

    # deserialized_file = np.frombuffer(file_body, dtype=np.int8)
    # print(deserialized_file, "DDDDDDDDDDDDDDDDDD")
    # serialized_file = np.reshape(deserialized_file, newshape=(2,2))
    # print(serialized_file, "FFFFFFFFFFFF")
    # return HttpResponse(status=200)



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

    # return HttpResponse(json.dumps(formatted), content_type="application/json")
    
# class TodoView(viewsets.ModelViewSet): 
#     serializer_class = TodoSerializer
#     queryset = Todo.objects.all()

    # def get(self, request):
    #     records = Todo.objects.all()
    #     serializer = TodoSerializer(records, many=True)
    #     print("++++++++++++++++++")
    #     return Response(serializer.data)

    # def get_queryset(self): 
    #     return Todo.objects.all()

