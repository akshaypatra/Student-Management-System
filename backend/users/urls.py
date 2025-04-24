from django.urls import path
from .views import RegisterView, LoginView, GetAllStudents, GetAllTeachers,DeleteUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('students/', GetAllStudents.as_view(), name='get-students'),
    path('teachers/', GetAllTeachers.as_view(), name='get-teachers'),
    path('delete-user/<str:user_id>/', DeleteUserView.as_view(), name='delete-user'),
]
