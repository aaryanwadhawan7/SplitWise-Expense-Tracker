import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            required
            disabled={loading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            disabled={loading}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-indigo-600 hover:underline"
            type="button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
