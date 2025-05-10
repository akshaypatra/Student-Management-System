import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser

from .models import ClassRoom, AttendanceTable, CorrectionRequest, Subject
from .serializers import ClassRoomSerializer, CreateClassRoomSerializer, AttendanceTableSerializer, \
    UpdateClassRoomSerializer, CorrectionRequestSerializer, SubjectSerializer
from users.models import CustomUser


"""
1. Create a classroom with subject, teacher, and student list via uploaded Excel
"""

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
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
def get_all_classrooms(request):
    
    classrooms = ClassRoom.objects.all()
    serializer = ClassRoomSerializer(classrooms, many=True)
    return Response(serializer.data)


"""
3. Get specific classroom details along with attendance
"""

@api_view(['GET'])
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
def get_classroom_attendance(request, classroom_id):
    
    classroom = ClassRoom.objects.filter(id=classroom_id).first()
    if not classroom:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    attendance_records = AttendanceTable.objects.filter(classroom=classroom)
    attendance_serializer = AttendanceTableSerializer(attendance_records, many=True)

    return Response({"attendance": attendance_serializer.data})


"""
8. Create an attendance correction request by the student
"""

@api_view(['POST'])
def create_attendance_correction(request):
    
    attendance_id = request.data.get('attendance_id')
    student_id = request.data.get('student_id')
    reason = request.data.get('reason')

    # Validate data
    if not attendance_id or not student_id or not reason:
        return Response({"error": "Attendance ID, Student ID, and reason are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        attendance_record = AttendanceTable.objects.get(id=attendance_id)
        student = CustomUser.objects.get(id=student_id)

        # Ensure the student is enrolled in the classroom for the attendance record
        if attendance_record.classroom not in student.enrolled_classes.all():
            return Response({"error": "Student not enrolled in this classroom."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the correction request
        correction_request = CorrectionRequest.objects.create(
            student=student,
            attendance_record=attendance_record,
            reason=reason
        )

        # Serialize and return the response
        serializer = CorrectionRequestSerializer(correction_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except AttendanceTable.DoesNotExist:
        return Response({"error": "Attendance record not found."}, status=status.HTTP_404_NOT_FOUND)
    except CustomUser.DoesNotExist:
        return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)


"""
9. View all attendance correction requests (Admin or Teacher access)
"""

@api_view(['GET'])
def view_all_corrections(request):
    
    correction_requests = CorrectionRequest.objects.all()
    serializer = CorrectionRequestSerializer(correction_requests, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


"""
10. Approve or Reject an attendance correction request
"""

@api_view(['PUT'])
def approve_or_reject_correction(request, request_id):
   
    try:
        correction_request = CorrectionRequest.objects.get(id=request_id)
    except CorrectionRequest.DoesNotExist:
        return Response({"error": "Correction request not found."}, status=status.HTTP_404_NOT_FOUND)

    status_choice = request.data.get('status')

    if status_choice not in ['approved', 'rejected']:
        return Response({"error": "Invalid status. Must be 'approved' or 'rejected'."}, status=status.HTTP_400_BAD_REQUEST)

    correction_request.status = status_choice
    correction_request.save()

    # Return the updated correction request
    serializer = CorrectionRequestSerializer(correction_request)
    return Response(serializer.data, status=status.HTTP_200_OK)


"""
11. Create a new subject
"""

@api_view(['POST'])
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
def get_all_subjects(request):
    
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


"""
13. Delete a subject
"""

@api_view(['DELETE'])
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





'''
in frontend to accept the excel file
<form action="/attendance/create-classroom/" method="POST" enctype="multipart/form-data">
    <label for="name">Classroom Name:</label>
    <input type="text" name="name" id="name" required>
    
    <label for="subject">Subject ID:</label>
    <input type="number" name="subject" id="subject" required>
    
    <label for="teacher">Teacher ID:</label>
    <input type="number" name="teacher" id="teacher" required>
    
    <label for="students_excel">Upload Student List (Excel):</label>
    <input type="file" name="students_excel" id="students_excel" accept=".xlsx, .xls" required>
    
    <button type="submit">Create Classroom</button>
</form>


'''