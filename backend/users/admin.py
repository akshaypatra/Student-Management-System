from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser

class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'name', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('email', 'name', 'id')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('id', 'name', 'email', 'password', 'role')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('id', 'name', 'email', 'password', 'role'),
        }),
    )

    filter_horizontal = ()

admin.site.register(CustomUser, CustomUserAdmin)
