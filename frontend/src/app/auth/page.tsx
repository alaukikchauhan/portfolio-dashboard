'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post('/auth/register', { username, email, password });
      }
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (error) {
      alert('Error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow w-100" style={{ maxWidth: "400px" }}>
        <div className="card-body p-4">
          <h2 className="card-title mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="form-control" required />
              </div>
            )}
            <div className="mb-3">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">{isRegister ? 'Register' : 'Login'}</button>
          </form>
          <p className="mt-3 text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }} className="text-primary text-decoration-none">
              {isRegister ? 'Have an account? Login' : 'Need an account? Register'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
