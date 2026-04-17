import { useState } from 'react';
import { login } from '../services/authService';
import { setAuth } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
// import HomeNavbar from '../components/Navbar/HomeNavbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
    

      setAuth(res.data);
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/sevas');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
   
    <AuthLayout title="Temple Login">
      <form onSubmit={handleSubmit}>
        <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <Button>Login</Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        New devotee? <Link to="/register">Register here</Link>
      </p>
    </AuthLayout>

  );
}

export default Login;
