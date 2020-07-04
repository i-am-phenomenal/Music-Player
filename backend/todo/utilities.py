from models import  Event
import names 

for iter in range(100): 
    name = names.get_full_name()
    url = "www." + "url_" + str(iter) + ".com"
    try:
        Event.objects.create(name = name, url = url)

    except Exception as e: 
        print(e)
        print("Not able to create record(s)")

print("Done :D")
