from django.db import models
from django.contrib.auth.models import User

class Budget(models.Model):
    title = models.CharField(max_length=200)
    chart_title = models.CharField(max_length=200,default='chart_title')
    chart_text  = models.CharField(max_length=200,default='chart_text')
    user = models.ForeignKey(User, related_name='budgets', on_delete=models.CASCADE,null=False,default=1)

    def __str__(self):
        return self.title

class Category(models.Model):
    text = models.TextField(blank=True)
    budget = models.ForeignKey(Budget, related_name='categories', on_delete=models.CASCADE,null=False,default=1)

    def __str__(self):
        return self.text
class Row(models.Model):

    text = models.TextField(blank=True)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, related_name='rows',on_delete=models.CASCADE,null=False,default=1)
    def __str__(self):
        return self.text

