import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Search, Trash2, ExternalLink, Clock,
  Building2, FileText, MapPin, ChevronDown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  'Planning':          { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
  'Applied':           { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'Online Assessment': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Interview':         { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
  'Offer':             { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  'Rejected':          { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export function Jobs() {
  const navigate             = useNavigate();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteId, setDeleteId]         = useState(null);
  const [deleteName, setDeleteName]     = useState('');

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs/all`, { headers: getHeaders() });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/jobs/${jobId}/status`,
        { status: newStatus },
        { headers: getHeaders() }
      );
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/jobs/${deleteId}`, { headers: getHeaders() });
      setJobs(prev => prev.filter(j => j.id !== deleteId));
      setDeleteId(null);
      setDeleteName('');
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (job) => {
    setDeleteId(job.id);
    setDeleteName(job.role);
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      j.role?.toLowerCase().includes(q) ||
      j.company_name?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length;
    return acc;
  }, {});

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading applications…</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            All Applications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} total</p>
        </div>
      </div>

      {/* ── Status summary cards ─────────────────────────────── */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {STATUS_OPTIONS.map(s => {
            const cfg     = STATUS_CONFIG[s];
            const count   = counts[s];
            const active  = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(active ? 'All' : s)}
                className={`rounded-xl p-3 text-left transition-all border ${
                  active
                    ? 'border-gray-400 ring-2 ring-gray-400/20 bg-white shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className={`text-2xl font-bold leading-none mb-1 ${cfg.text}`}>{count}</div>
                <div className="text-xs text-gray-500 leading-tight">{s}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Search + filter ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search role, company, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
        <div className="relative sm:w-48">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Empty states ─────────────────────────────────────── */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center">
          <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="h-7 w-7 text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900">No applications yet</p>
          <p className="text-xs text-gray-500 mt-1">Add jobs from the Companies page.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Search className="h-8 w-8 mb-2" />
          <p className="text-sm">No jobs match your search.</p>
          <button onClick={() => { setSearch(''); setStatusFilter('All'); }} className="text-xs text-blue-500 mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        /* ── Jobs table ──────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Company</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Location</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest hidden md:table-cell">Applied</th>
                  <th className="px-5 py-3.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, idx) => {
                  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG['Planning'];
                  return (
                    <tr
                      key={job.id}
                      className={`group border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors`}
                    >
                      {/* Role */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {job.job_link ? (
                            <a
                              href={job.job_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                            >
                              {job.role}
                              <ExternalLink className="h-3 w-3 opacity-50" />
                            </a>
                          ) : (
                            <span className="font-semibold text-gray-900">{job.role}</span>
                          )}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => navigate(`/company/${job.company_id}`)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group/co"
                        >
                          <div className="h-6 w-6 rounded-md bg-gray-100 group-hover/co:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                            <Building2 className="h-3 w-3 text-gray-500 group-hover/co:text-gray-700 transition-colors" />
                          </div>
                          <span className="text-sm font-medium truncate max-w-[100px]">{job.company_name}</span>
                        </button>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {job.location ? (
                          <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                            {job.location}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="relative inline-flex items-center">
                          <div className={`absolute left-2.5 w-1.5 h-1.5 rounded-full ${cfg.dot} pointer-events-none`} />
                          <select
                            value={job.status}
                            onChange={e => handleStatusChange(job.id, e.target.value)}
                            className={`pl-5 pr-6 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none ${cfg.bg} ${cfg.text}`}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className={`absolute right-1 h-3 w-3 pointer-events-none ${cfg.text}`} />
                        </div>
                      </td>

                      {/* Applied date */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {job.applied_date ? (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="h-3 w-3 shrink-0" />
                            {new Date(job.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => confirmDelete(job)}
                          className="p-1.5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{jobs.length}</span> applications
            </p>
            {statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Clear filter ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Delete Application</p>
                <p className="text-xs text-gray-400 mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5 bg-gray-50 rounded-lg px-3 py-2.5">
              "{deleteName}"
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 h-9 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => { setDeleteId(null); setDeleteName(''); }}
                className="flex-1 h-9 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
