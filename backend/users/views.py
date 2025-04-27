from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)

            if user:
                tokens = get_tokens_for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'tokens': tokens
                }, status=200)
            return Response({'detail': 'Invalid credentials'}, status=401)
        return Response(serializer.errors, status=400)

class GetAllStudents(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        students = CustomUser.objects.filter(role='student')
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)

class GetAllTeachers(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        teachers = CustomUser.objects.filter(role='teacher')
        serializer = UserSerializer(teachers, many=True)
        return Response(serializer.data)


class DeleteUserView(APIView):
    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)