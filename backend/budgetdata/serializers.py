from django.contrib.auth.models import User, Group
from rest_framework.fields import ReadOnlyField 
from .models import Budget, Category, Row
from rest_framework import serializers



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id']
class RowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Row
        fields = ['id','text','value','category_id']
        

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    rows=RowSerializer(many=True,read_only=True)    
    class Meta:
        model = Category
        fields = ['id','text','rows','budget_id']
        depth =1
class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    categories=CategorySerializer(many=True)
    class Meta:
        model = Budget
        fields = ['id','title','categories','user_id',"chart_title","chart_text"]
        depth = 2


