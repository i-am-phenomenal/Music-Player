import graphene
import todo.schema

class Query(todo.schema.Query, graphene.ObjectType): 
    pass

schema =   graphene.Schema(query=Query)