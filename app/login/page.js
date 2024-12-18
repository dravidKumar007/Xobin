"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/auth?email=${email}&password=${password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        setMessage('Login successful. Redirecting...');

        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-control">
            <label className="label text-gray-700">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered bg-white w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control">
            <label className="label text-gray-700">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered bg-white w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mt-4">
            <button type="submit" className="btn w-full bg-blue-500 text-white hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Don't have an account? 
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
