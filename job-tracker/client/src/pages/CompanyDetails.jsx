import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import {
  Building2, Plus, ExternalLink, Linkedin, Mail, Phone,
  ArrowRight, UserCircle2, Clock, ArrowLeft, Trash2, FileText
} from 'lucide-react';

const STATUS_STYLES = {
  'Planning':          'bg-gray-100 text-gray-700',
  'Applied':           'bg-blue-100 text-blue-700',
  'Online Assessment': 'bg-purple-100 text-purple-700',
  'Interview':         'bg-orange-100 text-orange-800',
  'Offer':             'bg-green-100 text-green-700',
  'Rejected':          'bg-red-100 text-red-700',
};

export function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [people, setPeople] = useState([]);
  const [companyNotes, setCompanyNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [newCompanyNote, setNewCompanyNote] = useState('');

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({ role: '', job_link: '', location: '', applied_date: '', status: 'Planning', notes: '' });
  const [jobError, setJobError] = useState('');

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personFormData, setPersonFormData] = useState({ name: '', role: '', linkedin_url: '', email: '', phone: '' });
  const [personError, setPersonError] = useState('');

  const fetchCompanyDetails = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/companies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setCompany(res.data);
  };
  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/jobs/company/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setJobs(res.data);
  };
  const fetchPeople = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/people/company/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setPeople(res.data);
  };
  const fetchCompanyNotes = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/company-notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setCompanyNotes(res.data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCompanyDetails(), fetchJobs(), fetchPeople(), fetchCompanyNotes()]);
      } catch (err) {
        setPageError('Failed to load company details.');
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const filteredJobs = jobs.filter(job => {
    const statusMatch = statusFilter === 'All' || job.status === statusFilter;
    const locMatch = !locationFilter || (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return statusMatch && locMatch;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddCompanyNote = async (e) => {
    e.preventDefault();
    if (!newCompanyNote.trim()) return;
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/company-notes/${id}`, { note: newCompanyNote }, { headers: { Authorization: `Bearer ${token}` } });
    setNewCompanyNote('');
    fetchCompanyNotes();
  };

  const handleDeleteCompanyNote = async (noteId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/company-notes/${noteId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchCompanyNotes();
  };

  const handleJobChange = (e) => setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs', { ...jobFormData, company_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      setJobFormData({ role: '', job_link: '', location: '', applied_date: '', status: 'Planning', notes: '' });
      setIsJobModalOpen(false);
      fetchJobs();
    } catch (err) {
      setJobError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job application?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:5000/api/jobs/${jobId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const handlePersonChange = (e) => setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });

  const handleCreatePerson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/people', { ...personFormData, company_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      setPersonFormData({ name: '', role: '', linkedin_url: '', email: '', phone: '' });
      setIsPersonModalOpen(false);
      fetchPeople();
    } catch (err) {
      setPersonError(err.response?.data?.message || 'Failed to create contact');
    }
  };

  const handleDeletePerson = async (personId) => {
    if (!window.confirm('Delete this contact?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/people/${personId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchPeople();
  };

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading…</p>
    </div>
  );

  if (pageError) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-red-500">
      <p className="text-sm mb-3">{pageError}</p>
      <Button onClick={() => window.location.reload()} variant="outline" size="sm">Retry</Button>
    </div>
  );

  if (!company) return <div className="p-8 text-center text-red-500 text-sm">Company not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/companies')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{company.name}</h1>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
              {company.website}
            </a>
          )}
        </div>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="people">People ({people.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({companyNotes.length})</TabsTrigger>
        </TabsList>

        {/* ── JOBS TAB ── */}
        <TabsContent value="jobs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="Filter location…"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-40 h-8 text-sm"
              />
              <select
                className="h-8 text-sm rounded-md border border-gray-200 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {Object.keys(STATUS_STYLES).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Job</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Add Job Application</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-3 mt-2">
                  {jobError && <p className="text-red-500 text-xs">{jobError}</p>}
                  <div className="space-y-1"><Label>Role *</Label><Input name="role" value={jobFormData.role} onChange={handleJobChange} required /></div>
                  <div className="space-y-1"><Label>Job Link</Label><Input name="job_link" value={jobFormData.job_link} onChange={handleJobChange} type="url" /></div>
                  <div className="space-y-1"><Label>Location</Label><Input name="location" value={jobFormData.location} onChange={handleJobChange} /></div>
                  <div className="space-y-1"><Label>Applied Date</Label><Input name="applied_date" value={jobFormData.applied_date} onChange={handleJobChange} type="date" /></div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <select name="status" value={jobFormData.status} onChange={handleJobChange} className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {Object.keys(STATUS_STYLES).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Button type="submit" className="w-full">Save Job</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Jobs table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="h-8 w-8 mb-2" />
                <p className="text-sm">No jobs found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applied</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredJobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {job.job_link ? (
                            <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                              {job.role} <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : job.role}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{job.location || '—'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={job.status}
                            onChange={e => handleUpdateStatus(job.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_STYLES[job.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {Object.keys(STATUS_STYLES).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {job.applied_date ? (
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.applied_date).toLocaleDateString()}</span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── PEOPLE TAB ── */}
        <TabsContent value="people">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Contacts</h2>
            <Dialog open={isPersonModalOpen} onOpenChange={setIsPersonModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Person</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
                <form onSubmit={handleCreatePerson} className="space-y-3 mt-2">
                  {personError && <p className="text-red-500 text-xs">{personError}</p>}
                  <div className="space-y-1"><Label>Name *</Label><Input name="name" value={personFormData.name} onChange={handlePersonChange} required /></div>
                  <div className="space-y-1"><Label>Role</Label><Input name="role" value={personFormData.role} onChange={handlePersonChange} /></div>
                  <div className="space-y-1"><Label>LinkedIn URL</Label><Input name="linkedin_url" value={personFormData.linkedin_url} onChange={handlePersonChange} type="url" /></div>
                  <div className="space-y-1"><Label>Email</Label><Input name="email" value={personFormData.email} onChange={handlePersonChange} type="email" /></div>
                  <div className="space-y-1"><Label>Phone</Label><Input name="phone" value={personFormData.phone} onChange={handlePersonChange} type="tel" /></div>
                  <Button type="submit" className="w-full">Save Contact</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {people.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center">
              <div className="h-14 w-14 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-3">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No contacts yet</h3>
              <p className="text-xs text-gray-500 mb-4">Add recruiters or employees to track networking.</p>
              <Button variant="outline" size="sm" onClick={() => setIsPersonModalOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Contact
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {people.map(person => (
                <div key={person.id} className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col">
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/person/${person.id}`)}
                          >
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-500">{person.role || 'Unspecified Role'}</p>
                        </div>
                      </div>
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 p-1 rounded transition-colors">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      {person.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{person.email}</div>}
                      {person.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{person.phone}</div>}
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/person/${person.id}`)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View Notes <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── NOTES TAB ── */}
        <TabsContent value="notes">
          <div className="max-w-2xl space-y-6">
            <form onSubmit={handleAddCompanyNote} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <Label htmlFor="companyNote" className="text-sm font-medium">Add a note</Label>
              <textarea
                id="companyNote"
                value={newCompanyNote}
                onChange={e => setNewCompanyNote(e.target.value)}
                className="w-full min-h-[90px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                placeholder="e.g. Referral hiring usually opens in August…"
                required
              />
              <Button type="submit" size="sm">Save Note</Button>
            </form>

            {companyNotes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {companyNotes.map(note => (
                  <li key={note.id} className="bg-white rounded-xl border border-gray-100 p-4 group relative">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap pr-8">{note.note}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{new Date(note.created_at).toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteCompanyNote(note.id)}
                      className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
