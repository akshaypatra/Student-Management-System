import React from "react";
import "./Home.css";
import student1 from "./images/student_dashboard.png"
import student2 from "./images/student_attendance_viewer.png"
import teacher1 from "./images/attendance_sheet.png"
import teacher2 from "./images/marking_attendance.png"
import teacher3 from "./images/Query_viewer.png"
import teacher4 from "./images/query_details.png"

import admin1 from "./images/admin_dashboard.png"
import admin2 from "./images/users_view.png"
import admin3 from "./images/classroom_creation.png"
import admin4 from "./images/classroom_update.png"

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-header-container">
        <h1>
          Empowering Education Through <br></br>Structure and Insights
        </h1>
        <h5>
          All-in-one digital platform designed to streamline <br></br>academic
          and administrative tasks in schools, colleges, and universities.
        </h5>
      </section>
      <section className="home-features-container">
        <h2>Key Features : </h2>

        
        <div className="features-container">
          
            <div className="feature-list"> 
                <div className="features-box" >
                    <h4>Student's Dashboard</h4>
                    <img src={student1} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                        The Student Dashboard lets students view enrolled classes and schedules, send queries to teachers, and track responses, ensuring organized academic management and seamless communication between students and faculty.
                    </h5>
                    </div>
                </div>
                <div className="features-box" >
                    <h4>Student's Analytics</h4>
                    <img src={student2} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       Student Analytics provides a clear overview of overall attendance percentage and displays a monthly attendance graph, helping students track their attendance trends and stay informed about their academic presence.
                    </h5>
                    </div>
                </div>
                <div className="features-box" >
                    <h4>Attendance Sheet (for teachers)</h4>
                    <img src={teacher1} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Attendance Sheet provides teachers with a detailed view of student attendance records for each date. It displays total students present, individual student details, and their total present and absent days. Teachers can easily manage attendance by clicking action icons to update records directly, ensuring efficient tracking and management of student participation in classes.
                    </h5>
                    </div>
                </div>
                <div className="features-box" >
                    <h4>Attendance Marking Sheet (for teachers)</h4>
                    <img src={teacher2} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Attendance Marking Sheet allows teachers to select a date and mark student attendance efficiently using action buttons. It updates data in real time, enabling students to view their attendance instantly on their dashboards. This streamlined process enhances accuracy and saves time, making it a more effective solution for daily attendance management.
                    </h5>
                    </div>
                </div>

                <div className="features-box" >
                    <h4>Query Viewer (for teachers)</h4>
                    <img src={teacher3} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Query Viewer enables teachers to efficiently manage student queries by offering powerful filtering and sorting options. Teachers can filter queries by status—approved, rejected, or pending—sort them by newest or oldest dates, and search for specific students by name or enrollment number. This organized interface streamlines communication and helps prioritize responses effectively.
                    </h5>
                    </div>
                </div>
                <div className="features-box" >
                    <h4>Query Detail (for teachers)</h4>
                    <img src={teacher4} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Query Detail Viewer allows teachers to view the full query message, check the sender's name and ID, and see when the query was created. Teachers can easily approve or reject the query directly from this interface, enabling quick and informed decision-making.
                    </h5>
                    </div>
                </div>

                <div className="features-box" >
                    <h4>Admin Dashboard </h4>
                    <img src={admin1} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Admin Dashboard provides a centralized control panel where admins can create and manage users, add subjects, and set up classrooms by assigning teachers and students. With complete authority over user management, admins can efficiently organize academic data, monitor platform activity, and ensure smooth functioning of the student management system.
                    </h5>
                    </div>
                </div>

                <div className="features-box" >
                    <h4>User Viewer (admin)</h4>
                    <img src={admin2} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The User Viewer allows the admin to view a complete list of all users, including teachers and students. It provides a convenient search functionality to quickly find specific users and offers the ability to delete users directly from the interface, ensuring effective and streamlined user management.
                    </h5>
                    </div>
                </div>

                <div className="features-box" >
                    <h4>Classroom Creation (admin)</h4>
                    <img src={admin3} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Classroom Creation Form enables the admin to efficiently create new classrooms by entering the class name, selecting a teacher, choosing a subject, and uploading a list of students via an Excel file. This structured approach ensures quick and organized assignment of class resources and participants, streamlining the setup process for academic sessions.
                    </h5>
                    </div>
                </div>

                <div className="features-box" >
                    <h4>Classroom Updation (admin)</h4>
                    <img src={admin4} className="features-image" alt="..."></img>
                    <div classname="features-body">
                    <h5 class="features-text">
                       The Classroom Updation Form allows the admin to modify existing classroom details, including the class name, assigned teacher, subject, and the student list. Admins can add, remove or update students , ensuring the classroom information stays current and accurate for smooth management.
                    </h5>
                    </div>
                </div>

                
            </div>
        </div>
      </section>
    </div>
  );
}
