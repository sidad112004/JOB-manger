import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Building2, Plus, ExternalLink, CalendarDays, FolderOpen, ArrowRight, Trash2 } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
export function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', website: '', notes: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
      setLoading(false);
    } catch (err) {
      setPageError('Failed to load companies. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/companies`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', website: '', notes: '' });
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) {
      console.error('Failed to delete company', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-0.5">{companies.length} tracked</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCompany} className="space-y-4 mt-2">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-1.5">
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Anthropic" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* States */}
      {pageError ? (
        <div className="flex flex-col items-center justify-center py-24 text-red-500">
          <p className="text-sm mb-3">{pageError}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">Retry</Button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm">Loading…</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center">
          <div className="h-16 w-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No companies yet</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">Start tracking applications by adding your first company.</p>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-base leading-tight">{company.name}</h3>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" /> {company.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                  <CalendarDays className="h-3 w-3" />
                  Added {new Date(company.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/company/${company.id}`)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
