import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [people, setPeople] = useState([]);
  const [companyNotes, setCompanyNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [newCompanyNote, setNewCompanyNote] = useState('');

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    role: '', job_link: '', location: '', applied_date: '', status: 'Planning', notes: ''
  });
  const [jobError, setJobError] = useState('');

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personFormData, setPersonFormData] = useState({
    name: '', role: '', linkedin_url: '', email: '', phone: ''
  });
  const [personError, setPersonError] = useState('');

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompany(res.data);
    } catch (err) {
      console.error('Failed to fetch company details', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/jobs/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchPeople = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/people/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPeople(res.data);
    } catch (err) {
      console.error('Failed to fetch people', err);
    }
  };

  const fetchCompanyNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/company-notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanyNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch company notes', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCompanyDetails(), fetchJobs(), fetchPeople(), fetchCompanyNotes()]);
      } catch (err) {
        setPageError('An error occurred while loading company details.');
      }
      setLoading(false);
    };
    initData();
  }, [id]);

  const filteredJobs = jobs.filter(job => {
    const statusMatch = statusFilter === 'All' || job.status === statusFilter;
    const locMatch = !locationFilter || (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return statusMatch && locMatch;
  });

  const handleAddCompanyNote = async (e) => {
    e.preventDefault();
    if (!newCompanyNote.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/company-notes/${id}`, { note: newCompanyNote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCompanyNote('');
      fetchCompanyNotes();
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleDeleteCompanyNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/company-notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanyNotes();
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  const handleJobChange = (e) => {
    setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs', { ...jobFormData, company_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobFormData({ role: '', job_link: '', location: '', applied_date: '', status: 'Planning', notes: '' });
      setIsJobModalOpen(false);
      fetchJobs();
    } catch (err) {
      setJobError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/jobs/${jobId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (err) {
      console.error('Failed to update job status', err);
    }
  };

  const handlePersonChange = (e) => {
    setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
  };

  const handleCreatePerson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/people', { ...personFormData, company_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonFormData({ name: '', role: '', linkedin_url: '', email: '', phone: '' });
      setIsPersonModalOpen(false);
      fetchPeople();
    } catch (err) {
      setPersonError(err.response?.data?.message || 'Failed to create contact');
    }
  };

  const handleDeletePerson = async (personId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/people/${personId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPeople();
    } catch (err) {
      console.error('Failed to delete person', err);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Loading Company Details...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-red-500">
        <p className="text-lg font-medium">{pageError}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (!company) return <div className="p-8 text-center text-red-500">Company not found or access denied.</div>;

  return (
    <div className="flex flex-col w-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                {company.website}
              </a>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate('/companies')}>Back to Companies</Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Input 
                  placeholder="Filter by location (e.g. Remote)" 
                  value={locationFilter} 
                  onChange={(e) => setLocationFilter(e.target.value)} 
                  className="w-full sm:w-48 bg-white"
                />
                <select 
                  className="w-full sm:w-40 flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Planning">Planning</option>
                  <option value="Applied">Applied</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
                <DialogTrigger asChild>
                  <Button>Add Job</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
                    {jobError && <p className="text-red-500 text-sm">{jobError}</p>}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role*</Label>
                      <Input id="role" name="role" value={jobFormData.role} onChange={handleJobChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_link">Job Link</Label>
                      <Input id="job_link" name="job_link" value={jobFormData.job_link} onChange={handleJobChange} type="url" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" value={jobFormData.location} onChange={handleJobChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applied_date">Applied Date</Label>
                      <Input id="applied_date" name="applied_date" value={jobFormData.applied_date} onChange={handleJobChange} type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status" 
                        name="status"
                        value={jobFormData.status} 
                        onChange={handleJobChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Planning">Planning</option>
                        <option value="Applied">Applied</option>
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full">Save Job</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No job applications found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          {job.job_link ? (
                            <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {job.role}
                            </a>
                          ) : (
                            job.role
                          )}
                        </TableCell>
                        <TableCell>{job.location || '-'}</TableCell>
                        <TableCell>
                          <select
                            value={job.status}
                            onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                          >
                            <option value="Planning">Planning</option>
                            <option value="Applied">Applied</option>
                            <option value="Online Assessment">Online Assessment</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {job.applied_date ? new Date(job.applied_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteJob(job.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="people" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Company Contacts</h2>
              <Dialog open={isPersonModalOpen} onOpenChange={setIsPersonModalOpen}>
                <DialogTrigger asChild>
                  <Button>Add Person</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Person</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreatePerson} className="space-y-4 mt-4">
                    {personError && <p className="text-red-500 text-sm">{personError}</p>}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name*</Label>
                      <Input id="name" name="name" value={personFormData.name} onChange={handlePersonChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" name="role" value={personFormData.role} onChange={handlePersonChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input id="linkedin_url" name="linkedin_url" value={personFormData.linkedin_url} onChange={handlePersonChange} type="url" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" value={personFormData.email} onChange={handlePersonChange} type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={personFormData.phone} onChange={handlePersonChange} type="tel" />
                    </div>
                    <Button type="submit" className="w-full">Save Contact</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        No contacts found. Add one to start networking!
                      </TableCell>
                    </TableRow>
                  ) : (
                    people.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/person/${person.id}`)}>
                          {person.name}
                        </TableCell>
                        <TableCell>{person.role || '-'}</TableCell>
                        <TableCell>
                          {person.linkedin_url ? (
                            <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Profile
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/person/${person.id}`)}>
                            View Notes
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePerson(person.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="bg-white rounded-lg border shadow-sm p-6 max-w-3xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Company Notes</h2>
              
              <form onSubmit={handleAddCompanyNote} className="mb-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyNote">Add a note about this company</Label>
                  <textarea 
                    id="companyNote"
                    value={newCompanyNote}
                    onChange={(e) => setNewCompanyNote(e.target.value)}
                    className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Referral hiring usually opens in August. They use a 4-round interview process..."
                    required
                  />
                </div>
                <Button type="submit">Save General Note</Button>
              </form>

              <div className="space-y-4">
                {companyNotes.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 border-t">No company notes yet. Add one above.</p>
                ) : (
                  <ul className="space-y-4">
                    {companyNotes.map(note => (
                      <li key={note.id} className="text-sm border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg relative group/note shadow-sm">
                        <p className="whitespace-pre-wrap pr-8 text-gray-800 text-base">{note.note}</p>
                        <button 
                          onClick={() => handleDeleteCompanyNote(note.id)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover/note:opacity-100 transition-opacity bg-white hover:bg-red-50 rounded"
                          title="Delete Note"
                        >
                          ✕
                        </button>
                        <span className="text-xs text-gray-400 block mt-3 font-medium">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
