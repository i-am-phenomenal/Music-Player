from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
import logging

# --------------- UTILITIES START ---------------

def log_exception(): 
    logging.error(traceback.format_exc())


# --------------- UTILITIES END ---------------


# Create your views here.

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
        # print(data, " >111111111111")
    # return HttpResponse(status=200)


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

