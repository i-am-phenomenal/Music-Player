# Generated by Django 3.0.4 on 2020-03-23 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_document_music_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='music_file',
            field=models.FileField(upload_to='music/'),
        ),
    ]
