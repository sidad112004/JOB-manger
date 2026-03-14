import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

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
      const res = await axios.get('http://localhost:5000/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch companies', err);
      setPageError('Failed to load companies. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/companies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', website: '', notes: '' });
      setIsModalOpen(false);
      fetchCompanies(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies(); // Refresh list
    } catch (err) {
      console.error('Failed to delete company', err);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Company</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCompany} className="space-y-4 mt-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name*</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
                </div>
                <Button type="submit" className="w-full">Save Company</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {pageError ? (
          <div className="flex flex-col items-center justify-center p-24 text-red-500">
            <p className="text-lg font-medium">{pageError}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Try Again</Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center p-24 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium animate-pulse">Loading Companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new company folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{company.name}</CardTitle>
                  <CardDescription>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.website}
                      </a>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/company/${company.id}`)}>Open</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCompany(company.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
