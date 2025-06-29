'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { register, checkAuth } from '@/store/authSlice';

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'customer'>('customer');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  // New state for showing/hiding passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  if (role === 'owner' && phone.trim() === '') {
    setError('Phone number is required for owners.');
    return;
  }

  try {
    // Dispatch register thunk
    await dispatch(
      register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role,
        phone: role === 'owner' ? phone : undefined,
      })
    ).unwrap();

    // After register, fetch authenticated user info
    const user = await dispatch(checkAuth()).unwrap();

    console.log('Authenticated user after register:', user);

    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'owner') {
      router.push('/owner/dashboard');
    } else {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  } catch (err: any) {
    // Extract backend validation errors
    if (err && err.errors && err.errors.email) {
      setError(err.errors.email[0]); // e.g. "The email has already been taken."
    } else {
      setError(err.message || 'Registration failed. Please try again.');
    }
  }
};



  // SVG icons for eye and eye-off
  const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const EyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.271-3.415M9.88 9.88a3 3 0 104.24 4.24"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name input */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      {/* Email input */}
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

      {/* Password input with eye toggle */}
      <div className="relative">
        <label>Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 transform -translate-y-1/2"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? EyeOffIcon : EyeIcon}
        </button>
      </div>

      {/* Confirm Password input with eye toggle */}
      <div className="relative">
        <label>Confirm Password:</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="border p-2 w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 transform -translate-y-1/2"
          tabIndex={-1}
          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
        >
          {showConfirmPassword ? EyeOffIcon : EyeIcon}
        </button>
      </div>

      {/* Role select */}
      <div>
        <label>Role:</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'owner' | 'customer')}
          className="border p-2 w-full"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Phone input if role is owner */}
      {role === 'owner' && (
        <div>
          <label>Phone Number (required for owners):</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required={role === 'owner'}
            className="border p-2 w-full"
            placeholder="+212 6XXXXXXXX"
          />
        </div>
      )}

      <button type="submit" className="bg-yellow-500 text-white py-2 rounded">
        Register
      </button>

      {error && <div className="text-red-500">{error}</div>}

      <div className="text-center mt-4">
        <p>
          Already have an account? <a href="/login" className="text-blue-600">Login here</a>
        </p>
      </div>
    </form>
  );
}
