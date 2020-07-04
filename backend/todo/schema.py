import graphene 
from graphene_django import DjangoObjectType 
from .models import Event 

class EventType(DjangoObjectType): 
    class Meta: 
        model = Event 

class Query(graphene.ObjectType): 
    events = graphene.List(EventType)

    def resolve_events(self, info, **kwargs):
        return Event.objects.all()

    def resolve_actor(self, info, **kwargs): 
        id = kwargs.get('id')

        if id is not None: 
            return Event.objects.get(id=id)

        else:
            return None


class EventInput(graphene.InputObjectType):
    id=  graphene.ID()
    name =  graphene.String()  
    url = graphene.String()


#WIP 