import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [password2,setPassword2]= useState('');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await api.post('/api/register/', { username, email, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers['Authorization'] = `Token ${data.token}`;
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.password?.[0] ||
        'Registration failed'
      );
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required/>
        </div>
        <div className="form-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div className="form-field">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <div className="form-field">
          <label>Confirm Password</label>
          <input type="password" value={password2} onChange={e=>setPassword2(e.target.value)} required/>
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
