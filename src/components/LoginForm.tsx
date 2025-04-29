'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { login } from '@/store/authSlice';

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await dispatch(login({ email, password })).unwrap();

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <button type="submit" className="bg-yellow-500 text-white py-2 rounded">
        Login
      </button>

      {error && <div className="text-red-500">{error}</div>}

      <div className="text-center mt-4">
        <p>
          Don't have an account? <a href="/register" className="text-blue-600">Register here</a>
        </p>
        <p className="mt-2">
          <a href="/forgotpassword" className="text-blue-600">Forgot your password?</a>
        </p>
      </div>
    </form>
  );
}
