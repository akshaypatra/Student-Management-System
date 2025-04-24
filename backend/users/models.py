from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, id, name, email, password=None, role=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not id:
            raise ValueError("Users must have an ID")
        if not name:
            raise ValueError("Users must have a name")
        if not role:
            raise ValueError("Users must have a role")

        email = self.normalize_email(email)
        user = self.model(
            id=id,
            name=name,
            email=email,
            role=role,
        )
        user.set_password(password)
        user.is_active = True
        user.is_staff = role == 'teacher'
        user.save(using=self._db)
        return user

    def create_superuser(self, id, name, email, password=None):
        user = self.create_user(
            id=id,
            name=name,
            email=email,
            password=password,
            role='teacher',  # Superusers are always teachers (or admins)
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    
    id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    password = models.CharField(max_length=128)

    objects = CustomUserManager()

    is_staff = models.BooleanField(default=False)   
    is_active = models.BooleanField(default=True) 

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['id', 'name']

    def __str__(self):
        return f"{self.name} ({self.role})"
