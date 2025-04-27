from django.urls import path
from . import views

urlpatterns = [
    # 1. Classroom Endpoints
    path('classrooms/create/', views.create_classroom, name='create_classroom'),
    path('classrooms/', views.get_all_classrooms, name='get_all_classrooms'),
    path('classrooms/<int:classroom_id>/', views.get_classroom_details, name='get_classroom_details'),
    path('classrooms/<int:classroom_id>/update/', views.update_classroom, name='update_classroom'),
    path('classrooms/<int:classroom_id>/delete/', views.delete_classroom, name='delete_classroom'),
    
    # 2. Attendance Management
    path('mark/', views.mark_attendance, name='mark_attendance'),
    path('classrooms/<int:classroom_id>/attendance/', views.get_classroom_attendance, name='get_classroom_attendance'),
    
    # 3. Attendance Correction Request
    path('corrections/create/', views.create_attendance_correction, name='create_attendance_correction'),
    path('corrections/', views.view_all_corrections, name='view_all_corrections'),
    path('corrections/<int:request_id>/', views.approve_or_reject_correction, name='approve_or_reject_correction'),
    
    # 4. Subject Management
    path('subjects/create/', views.create_subject, name='create_subject'),
    path('subjects/', views.get_all_subjects, name='get_all_subjects'),
    path('subjects/delete/<int:subject_id>/', views.delete_subject, name='delete_subject'),
    path('subjects/update/<int:subject_id>/', views.update_subject, name='update_subject'),
]
