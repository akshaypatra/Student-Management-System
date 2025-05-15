from django.db import models
from django.contrib.auth.models import AbstractUser
from users.models import CustomUser


class Subject(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)  # A unique code for each subject
    
    def __str__(self):
        return self.name


class ClassRoom(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        'users.CustomUser', 
        limit_choices_to={'role': 'teacher'}, 
        on_delete=models.CASCADE,
        related_name='teaching_classes'  # <--- unique related_name
    )
    students = models.ManyToManyField(
        'users.CustomUser', 
        limit_choices_to={'role': 'student'},
        related_name='enrolled_classes'  # <--- unique related_name
    )

    def __str__(self):
        return self.name


class AttendanceTable(models.Model):
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    enrollment_number = models.CharField(max_length=20)
    student_name = models.CharField(max_length=255)
    total_attendance = models.IntegerField(default=0)
    attendance_dates = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('classroom', 'enrollment_number')

    def __str__(self):
        return f"{self.student_name} - {self.classroom.name}"


class Query(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='queries')
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_queries', limit_choices_to={'role': 'teacher'})
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Query from {self.student.get_full_name()} to {self.teacher.get_full_name()}"

