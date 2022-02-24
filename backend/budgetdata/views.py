from django.http.response import HttpResponse, JsonResponse 
from django.shortcuts import render
from django.views.generic.base import View

# Create your views here.
from budgetdata.models import Budget, Category, Row
from rest_framework import viewsets
from rest_framework import permissions
from budgetdata.serializers import BudgetSerializer, CategorySerializer, RowSerializer
from django.contrib.auth import authenticate


from rest_framework.authentication import  BasicAuthentication #SessionAuthentication,
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class Auth(APIView):
    authentication_classes = [ BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
        }
        return Response(content)




        
class BudgetViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    def get_queryset(self):
        user = self.request.user
        return Budget.objects.filter(user=user)
    #permission_classes = [permissions.IsAuthenticated]
    def create(self, request, *args, **kwargs):
        user = self.request.user
        b=Budget(title=request.data['title'],user=user)
        b.save()
        data = BudgetSerializer(b).data
        return JsonResponse(data=data, status=201)
class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    '''def get_queryset(self):
        user = self.request.user
        b=Budget.objects.filter(user=user)
        return Category.objects.filter(budget=b[0])'''
    def create(self, request, *args, **kwargs):
        b=Budget.objects.get(pk=request.data['budget_id'])
        c=Category(budget=b,**request.data)
        c.save()
        data = CategorySerializer(c).data

        return JsonResponse(data=data, status=201)
    permission_classes = [permissions.AllowAny]
class RowViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Row.objects.all()
    serializer_class = RowSerializer
    '''def get_queryset(self):
        user = self.request.user
        b=Budget.objects.filter(user=user)
        c=Category.objects.filter(budget=b[0])
        return Row.objects.filter(category=c[0])'''
    def create(self, request, *args, **kwargs):
        b=Budget.objects.get(pk=request.data['budget_id'])
        print("b=")
        print(b)
        c=b.categories.get(pk=request.data['category_id'])
        print("c=")
        print(c)
        r=Row(category=c,text=request.data["text"],value=0)
        print("r=")
        print(r)
        r.save()
        print("ee")
        data = RowSerializer(r).data
        return JsonResponse(data=data, status=201)
    permission_classes = [permissions.AllowAny]