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
    path('update/', views.update_attendance, name='update_attendance'),
    
    # 3. Queries Request
    path('queries/create/', views.create_query, name='create-query'),
    path('queries/', views.list_queries, name='list-queries'),
    path('queries/<int:pk>/update-status/', views.update_query_status, name='update-query-status'),
    path('queries/student-status/', views.student_query_status, name='student-query-status'),

    
    # 4. Subject Management
    path('subjects/create/', views.create_subject, name='create_subject'),
    path('subjects/', views.get_all_subjects, name='get_all_subjects'),
    path('subjects/delete/<int:subject_id>/', views.delete_subject, name='delete_subject'),
    path('subjects/update/<int:subject_id>/', views.update_subject, name='update_subject'),
]
