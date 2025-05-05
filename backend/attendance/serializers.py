from rest_framework import serializers
from .models import ClassRoom, AttendanceTable, Subject, CorrectionRequest
from users.models import CustomUser  


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']  # Including both 'name' and 'code' in one serializer


class AttendanceTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceTable
        fields = ['id', 'classroom', 'enrollment_number', 'student_name', 'total_attendance', 'attendance_dates']


class ClassRoomSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()  # Nested SubjectSerializer
    students = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='student'), many=True)

    class Meta:
        model = ClassRoom
        fields = ['id', 'name', 'subject', 'teacher', 'students']


class CreateClassRoomSerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    teacher = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='teacher'))
    students = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='student'), many=True)

    class Meta:
        model = ClassRoom
        fields = ['name', 'subject', 'teacher', 'students']


class UpdateClassRoomSerializer(serializers.ModelSerializer):
    teacher = serializers.SlugRelatedField(
        slug_field='id',
        queryset=CustomUser.objects.filter(role='teacher'),
        required=False
    )
    students = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='student'), many=True, required=False)

    class Meta:
        model = ClassRoom
        fields = ['name','teacher', 'students']
    
class CorrectionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectionRequest
        fields = ['id', 'student', 'attendance_record', 'reason', 'status', 'created_at', 'updated_at']
