"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post('/api/auth', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        const authToken = response.data.token;
        localStorage.setItem('token', authToken);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        setMessage('Signup successful. Redirecting...');

        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Sign In</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="form-control">
            <label className="label text-gray-700">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input bg-white input-bordered w-full px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="form-control">
            <label className="label text-gray-700">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input bg-white input-bordered w-full px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="input input-bordered w-full bg-white px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="form-control">
            <label className="label text-gray-700">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered bg-white w-full px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="form-control mt-4">
            <button type="submit" className="btn w-full bg-teal-500 text-white hover:bg-teal-600">
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-teal-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
