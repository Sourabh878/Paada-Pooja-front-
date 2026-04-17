import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registration successful');
      navigate('/login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <AuthLayout title="Devotee Registration">
      <form onSubmit={handleSubmit}>
        <Input name="full_name" placeholder="Full Name" onChange={handleChange} />
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <Button>Register</Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
