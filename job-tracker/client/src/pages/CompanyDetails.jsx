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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchCompanyDetails(), fetchJobs(), fetchPeople()]);
      setLoading(false);
    };
    initData();
  }, [id]);

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


  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!company) return <div className="p-8 text-center text-red-500">Company not found or access denied.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
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
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No job applications found. Add one to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
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
        </Tabs>
      </main>
    </div>
  );
}
