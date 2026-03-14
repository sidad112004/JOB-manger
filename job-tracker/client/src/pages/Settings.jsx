import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, Trash2, Check, AlertTriangle, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  // ── Change password ─────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');

    if (pwForm.new_password.length < 6) {
      setPwError('New password must be at least 6 characters.'); return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError('New passwords do not match.'); return;
    }

    setPwLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        { current_password: pwForm.current_password, new_password: pwForm.new_password },
        { headers: getHeaders() }
      );
      setPwSuccess('Password updated successfully.');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    }
    setPwLoading(false);
  };

  // ── Delete account ──────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Please type DELETE exactly to confirm.'); return;
    }
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/api/auth/delete-account`, { headers: getHeaders() });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  return (

    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── Change Password ───────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Change Password ?</h2>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            {pwError && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 text-sm">
                <Check className="h-4 w-4 shrink-0" />
                {pwSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                value={pwForm.current_password}
                onChange={handlePwChange}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                value={pwForm.new_password}
                onChange={handlePwChange}
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={pwForm.confirm_password}
                onChange={handlePwChange}
                placeholder="Repeat new password"
                required
              />
            </div>

            <Button type="submit" size="sm" className="gap-1.5" disabled={pwLoading}>
              {pwLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
                : <><Check className="h-3.5 w-3.5" />Update Password</>
              }
            </Button>
          </form>
        </div>

        {/* ── Delete Account ────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-50 flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-600">Delete Account</h2>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Permanently deletes your account and all data — companies, jobs, people, notes and follow-ups.
              <strong className="text-gray-700"> This cannot be undone.</strong>
            </p>

            {!showDeleteForm ? (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 gap-1.5"
                onClick={() => setShowDeleteForm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete My Account
              </Button>
            ) : (
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                {deleteError && (
                  <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    {deleteError}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="delete-confirm">
                    Type <span className="font-bold text-red-600 font-mono">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="border-red-200 focus:border-red-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
                    disabled={deleteLoading || deleteConfirm !== 'DELETE'}
                  >
                    {deleteLoading
                      ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>
                      : <><Trash2 className="h-3.5 w-3.5" />Confirm Delete</>
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setShowDeleteForm(false); setDeleteConfirm(''); setDeleteError(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
