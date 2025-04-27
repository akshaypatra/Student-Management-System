import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AdminDashboard from './Dashboards/AdminDashboard';
import TeacherDashboard from './Dashboards/TeacherDashboard';
import StudentDashboard from './Dashboards/StudentDashboard';
import Contact from './Components/Contact';
import Login from './Pages/Login';

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
        </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
