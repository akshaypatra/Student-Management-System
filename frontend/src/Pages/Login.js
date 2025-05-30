import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { FaUserCircle } from 'react-icons/fa'; 
import baseUrl from '../Dashboards/BaseUrl';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/login/`, {
        email,
        password
      });

      const { user, tokens } = response.data;

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('id', user.id);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('is_superuser', user.is_superuser);

      if (user.is_superuser) {
        navigate('/admin-dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (user.role === 'student') {
        navigate('/student-dashboard');
      } else {
        alert('Unknown user role!');
      }
      window.location.reload();

    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 shadow" style={{ width: '100%', maxWidth: '450px' }}>
        
        <div className="text-center mb-4 text-primary fw-bold" style={{ fontSize: '2rem' }}>
          <FaUserCircle className="me-2" /> Welcome back
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ fontSize: '1rem' }}>Email address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label" style={{ fontSize: '1rem' }}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Eye Icon Button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="btn position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ background: 'none', border: 'none' }}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={20} className='icons' /> : <FaEye size={20} className='icons' />}
            </button>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
