import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes,permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import ClassRoom, AttendanceTable, Query, Subject
from .serializers import ClassRoomSerializer, CreateClassRoomSerializer, AttendanceTableSerializer, \
    UpdateClassRoomSerializer, SubjectSerializer,QuerySerializer
from users.models import CustomUser


"""
1. Create a classroom with subject, teacher, and student list via uploaded Excel
"""

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def create_classroom(request):
    
    classroom_serializer = CreateClassRoomSerializer(data=request.data)
    
    if not classroom_serializer.is_valid():
        return Response(classroom_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    classroom = classroom_serializer.save()

    # Process Excel file
    excel_file = request.FILES.get('students_excel')
    if not excel_file:
        return Response({"error": "Excel file with students is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        df = pd.read_excel(excel_file)

        if not {'enrollment_number', 'student_name'}.issubset(df.columns):
            return Response({"error": "Excel must contain 'enrollment_number' and 'student_name' columns."},
                            status=status.HTTP_400_BAD_REQUEST)

        for _, row in df.iterrows():
            enrollment_number = str(row['enrollment_number']).strip()
            student_name = str(row['student_name']).strip()

            student = CustomUser.objects.filter(id=enrollment_number, role='student').first()

            if not student:
                return Response(
                    {"error": f"Student with enrollment number {enrollment_number} not found."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            classroom.students.add(student)

            AttendanceTable.objects.create(
                classroom=classroom,
                enrollment_number=enrollment_number,
                student_name=student_name,
                total_attendance=0,
                attendance_dates={}  # Initialize as empty JSON object
            )

        return Response({"message": "Classroom created and students added successfully."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Failed to process Excel file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


"""
2. Get a list of all classrooms
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_classrooms(request):
    
    classrooms = ClassRoom.objects.all()
    serializer = ClassRoomSerializer(classrooms, many=True)
    return Response(serializer.data)


"""
3. Get specific classroom details along with attendance
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_classroom_details(request, classroom_id):
    
    classroom = ClassRoom.objects.filter(id=classroom_id).first()
    if not classroom:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    attendance_records = AttendanceTable.objects.filter(classroom=classroom)
    attendance_serializer = AttendanceTableSerializer(attendance_records, many=True)

    return Response({
        "classroom": classroom.name,
        "subject": classroom.subject.name,
        "teacher": classroom.teacher.get_username(),
        "attendance": attendance_serializer.data
    })


"""
4. Update classroom details like name, subject, teacher, students
"""

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_classroom(request, classroom_id):
   
    try:
        classroom = ClassRoom.objects.get(id=classroom_id)
    except ClassRoom.DoesNotExist:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UpdateClassRoomSerializer(classroom, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Classroom updated successfully", "classroom": serializer.data}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
5. Delete a classroom and all related attendance records
"""

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_classroom(request, classroom_id):
    
    try:
        classroom = ClassRoom.objects.get(id=classroom_id)
        classroom.delete()
        return Response({"message": "Classroom deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except ClassRoom.DoesNotExist:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)


"""
6. Mark attendance for a classroom by the teacher
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    
    classroom_id = request.data.get('classroom_id')
    date = request.data.get('date')
    attendance = request.data.get('attendance')  # List of {"student_id": id, "status": "present/absent"}

    classroom = ClassRoom.objects.filter(id=classroom_id).first()
    if not classroom:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    attendance_records = []
    for record in attendance:
        student = CustomUser.objects.filter(id=record['student_id'], role='student').first()
        if not student:
            return Response({"error": f"Student with ID {record['student_id']} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the student is in the classroom before marking attendance
        if student not in classroom.students.all():
            return Response({"error": f"Student {student.get_full_name()} is not in this classroom."}, status=status.HTTP_400_BAD_REQUEST)

        attendance_record = AttendanceTable.objects.filter(
            classroom=classroom,
            enrollment_number=student.id
            ).first()

        if not attendance_record:
            attendance_record = AttendanceTable.objects.create(
                classroom=classroom,
                enrollment_number=student.id,
                student_name=student.get_username(),
                attendance_dates={},
                total_attendance=0
            )

        # Ensure attendance_dates is not None
        if attendance_record.attendance_dates is None:
            attendance_record.attendance_dates = {}

        attendance_record.attendance_dates[date] = record['status']
        attendance_record.total_attendance += 1 if record['status'] == 'present' else 0
        attendance_record.save()
        attendance_records.append(attendance_record)

    return Response({"message": "Attendance marked successfully"}, status=status.HTTP_200_OK)


'''
6.2 update attendance of students
'''

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_attendance(request):
    classroom_id = request.data.get('classroom_id')
    date = request.data.get('date')
    updates = request.data.get('updates')  # Optional: List of {"student_id": id, "status": "present"/"absent"}
    delete_for_all = request.data.get('delete', False)

    if not classroom_id or not date:
        return Response({"error": "classroom_id and date are required."}, status=status.HTTP_400_BAD_REQUEST)

    classroom = ClassRoom.objects.filter(id=classroom_id).first()
    if not classroom:
        return Response({"error": "Classroom not found."}, status=status.HTTP_404_NOT_FOUND)

    if delete_for_all:
        # Remove the date entry for all students in the classroom
        students = classroom.students.all()
        for student in students:
            record = AttendanceTable.objects.filter(classroom=classroom, enrollment_number=student.id).first()
            if record and record.attendance_dates and date in record.attendance_dates:
                if record.attendance_dates[date] == 'present':
                    record.total_attendance -= 1
                del record.attendance_dates[date]
                record.save()
        return Response({"message": f"Attendance for {date} deleted for all students."}, status=status.HTTP_200_OK)

    if not updates:
        return Response({"error": "Either 'updates' must be provided or 'delete' set to true."}, status=status.HTTP_400_BAD_REQUEST)

    for update in updates:
        student_id = update.get('student_id')
        new_status = update.get('status')

        student = CustomUser.objects.filter(id=student_id, role='student').first()
        if not student:
            return Response({"error": f"Student with ID {student_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        if student not in classroom.students.all():
            return Response({"error": f"Student {student.get_full_name()} is not in this classroom."}, status=status.HTTP_400_BAD_REQUEST)

        record = AttendanceTable.objects.filter(classroom=classroom, enrollment_number=student.id).first()
        if not record:
            return Response({"error": f"No attendance record found for student {student.get_full_name()}."}, status=status.HTTP_404_NOT_FOUND)

        old_status = record.attendance_dates.get(date)

        # Adjust total_attendance if needed
        if old_status == 'present' and new_status != 'present':
            record.total_attendance -= 1
        elif old_status != 'present' and new_status == 'present':
            record.total_attendance += 1

        record.attendance_dates[date] = new_status
        record.save()

    return Response({"message": "Attendance updated successfully."}, status=status.HTTP_200_OK)




"""
7. Get the attendance table for a classroom
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_classroom_attendance(request, classroom_id):
    
    
    classroom = ClassRoom.objects.filter(id=classroom_id).first()
    if not classroom:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    attendance_records = AttendanceTable.objects.filter(classroom=classroom)
    attendance_serializer = AttendanceTableSerializer(attendance_records, many=True)

    return Response({"attendance": attendance_serializer.data})


"""
8. Create an query by the student
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_query(request):
    if request.user.role != 'student':
        return Response({'detail': 'Only students can post queries.'}, status=403)

    teacher_id = request.data.get('teacher')
    message = request.data.get('message')

    if not teacher_id or not message:
        return Response({'detail': 'Teacher ID and message are required.'}, status=400)

    try:
        teacher = CustomUser.objects.get(id=teacher_id, role='teacher')
    except CustomUser.DoesNotExist:
        return Response({'detail': 'Teacher not found.'}, status=404)

    serializer = QuerySerializer(data={'teacher': teacher.id, 'message': message})
    if serializer.is_valid():
        serializer.save(student=request.user, teacher=teacher)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)



"""
9. View all queries 
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_queries(request):
    user = request.user
    if user.role == 'student':
        queries = Query.objects.filter(student=user)
    elif user.role == 'teacher':
        queries = Query.objects.filter(teacher=user)
    else:
        return Response({'detail': 'Access denied.'}, status=403)

    serializer = QuerySerializer(queries, many=True)
    return Response(serializer.data)



"""
10. Approve or Reject an attendance correction request
"""

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_query_status(request, pk):
    try:
        query = Query.objects.get(pk=pk)
    except Query.DoesNotExist:
        return Response({'detail': 'Query not found.'}, status=404)

    if request.user.role != 'teacher' or query.teacher != request.user:
        return Response({'detail': 'Permission denied.'}, status=403)

    new_status = request.data.get('status')
    if new_status not in ['approved', 'rejected']:
        return Response({'detail': 'Invalid status.'}, status=400)

    query.status = new_status
    query.save()

    serializer = QuerySerializer(query)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_query_status(request):
    if request.user.role != 'student':
        return Response({'detail': 'Only students can access this.'}, status=403)

    queries = Query.objects.filter(student=request.user)
    serializer = QuerySerializer(queries, many=True)
    return Response(serializer.data)


"""
11. Create a new subject
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subject(request):
   
    serializer = SubjectSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
12. Get a list of all subjects
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_subjects(request):
    
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


"""
13. Delete a subject
"""

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_subject(request, subject_id):
    try:
        subject = Subject.objects.get(id=subject_id)
        subject.delete()
        return Response({'message': 'Subject deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found.'}, status=status.HTTP_404_NOT_FOUND)

"""
14. Update a subject
"""

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_subject(request, subject_id):
    try:
        subject = Subject.objects.get(id=subject_id)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SubjectSerializer(subject, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






