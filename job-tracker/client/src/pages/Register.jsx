import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Briefcase } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">Reachlist</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Create an account</h1>
          <p className="text-sm text-gray-500 mb-6">Start tracking your job search</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
