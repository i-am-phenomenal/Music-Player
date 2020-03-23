from django.db import models
import os
import uuid 
# Create your models here.

class Todo(models.Model): 
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Document(models.Model): 
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    music_file = models.FileField(upload_to='music/')
    music_name = models.CharField(max_length=50)
    extension = models.CharField(max_length=10, default='mp3', editable=False)
    is_being_played = models.BooleanField(default=False)
    music_size =  models.IntegerField(default=0)

    def __str__(self): 
        return self.music_name 

    def return_file_name(self): 
        return os.path.basename(self.music_file.name)