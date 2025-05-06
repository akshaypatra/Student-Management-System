import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AdminDashboard from './Dashboards/AdminDashboard';
import TeacherDashboard from './Dashboards/TeacherDashboard';
import StudentDashboard from './Dashboards/StudentDashboard';
import Contact from './Components/Contact';
import Login from './Pages/Login';
import AddUser from './Dashboards/AdminDashboardComponents/AddUser';
import AddSubject from './Dashboards/AdminDashboardComponents/AddSubject';
import UpdateClassroom from './Dashboards/AdminDashboardComponents/UpdateClassroom';
import AddClassroomForm from './Dashboards/AdminDashboardComponents/AddClassroomForm';
import AttendanceView from './Dashboards/TeacherDashboardComponents/AttendanceView';
import MarkAttendance from './Dashboards/TeacherDashboardComponents/MarkAttendance';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Navbar />
        
        
        <section className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/register' element={<AddUser/>}/>
          <Route path='/add-subject' element={<AddSubject/>}/>
          <Route path="/update-classroom/:classroomId" element={<UpdateClassroom/>} />
          <Route path="/add-classroom" element={<AddClassroomForm/>} />
          <Route path="/classroom/:classId/:className" element={<AttendanceView/>} />
          <Route path='/classrooms/:classId/mark-attendance/:className' element={<MarkAttendance/>}/>
        </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
