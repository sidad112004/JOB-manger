import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Search, Users, Building2, Linkedin, Mail,
  Phone, ArrowRight, Trash2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export function People() {
  const navigate               = useNavigate();
  const [people, setPeople]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchPeople = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/people/all`, { headers: getHeaders() });
      setPeople(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeople(); }, []);

  const handleDelete = async (personId) => {
    try {
      await axios.delete(`${API_URL}/api/people/${personId}`, { headers: getHeaders() });
      setPeople(prev => prev.filter(p => p.id !== personId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = people.filter(p => {
    const q = search.toLowerCase();
    return !q ||
      p.name?.toLowerCase().includes(q) ||
      p.company_name?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading contacts…</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          All Contacts
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{people.length} people tracked</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search name, company, role, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        />
      </div>

      {/* People list */}
      {people.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center">
          <Users className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-900">No contacts yet</p>
          <p className="text-xs text-gray-500 mt-1">Add people from the Companies page.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Search className="h-8 w-8 mb-2" />
          <p className="text-sm">No contacts match your search.</p>
        </div>
      ) : (
        <>
          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(person => (
              <div
                key={person.id}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="p-4 flex-1">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer transition-colors truncate"
                          onClick={() => navigate(`/person/${person.id}`)}
                        >
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{person.role || 'No role'}</p>
                      </div>
                    </div>
                    {/* LinkedIn icon */}
                    {person.linkedin_url && (
                      <a
                        href={person.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 p-1 rounded transition-colors shrink-0"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Company */}
                  <button
                    onClick={() => navigate(`/company/${person.company_id}`)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-3 w-full text-left"
                  >
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{person.company_name || '—'}</span>
                  </button>

                  {/* Contact details */}
                  <div className="space-y-1.5">
                    {person.email && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{person.email}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{person.phone}</span>
                      </div>
                    )}
                    {person.linkedin_url && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Linkedin className="h-3 w-3 shrink-0" />
                        <a
                          href={person.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate"
                        >
                          {person.linkedin_url.replace('https://www.linkedin.com/in/', '').replace(/\/$/, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/person/${person.id}`)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View Notes <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setDeleteId(person.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Showing {filtered.length} of {people.length} contacts
          </p>
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Delete Contact</p>
                <p className="text-xs text-gray-500 mt-0.5">All notes and follow-ups will be deleted.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{' '}
              <strong>{people.find(p => p.id === deleteId)?.name}</strong>?
              This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 h-9 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
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
