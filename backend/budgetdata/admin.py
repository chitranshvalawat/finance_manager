from django.contrib import admin
from .models import Budget, Category , Row


class CategoryAdmin(admin.ModelAdmin):
    list_display = ( 'text','budget_id')
class RowAdmin(admin.ModelAdmin):
    list_display = ( 'text', 'text','value','category')
class BudgetAdmin(admin.ModelAdmin):
    list_display = ( 'title', )




admin.site.register(Row, RowAdmin)
admin.site.register(Budget, BudgetAdmin)





admin.site.register(Category, CategoryAdmin)
