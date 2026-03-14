import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [notes, setNotes] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newNote, setNewNote] = useState('');
  const [newFollowupDate, setNewFollowupDate] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [personRes, notesRes, followupsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/people/${id}`, { headers }),
        axios.get(`http://localhost:5000/api/person-notes/${id}`, { headers }),
        axios.get(`http://localhost:5000/api/followups/person/${id}`, { headers })
      ]);

      setPerson(personRes.data);
      setNotes(notesRes.data);
      setFollowups(followupsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch person details', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/person-notes', 
        { person_id: id, note: newNote }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote('');
      fetchData();
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/person-notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!newFollowupDate) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/followups', 
        { person_id: id, followup_date: newFollowupDate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewFollowupDate('');
      fetchData();
    } catch (err) {
      console.error('Failed to add follow-up', err);
    }
  };

  const handleCompleteFollowup = async (followupId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/followups/${followupId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to complete follow-up', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Loading Person...</p>
      </div>
    );
  }
  if (!person) return <div className="p-8 text-center text-red-500">Person not found or access denied.</div>;

  return (
    <div className="flex flex-col w-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{person.name}</h1>
            <p className="text-sm text-gray-500">{person.role || 'No specific role'}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/company/${person.company_id}`)}>Back to Company</Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Contact Details</h2>
            <div className="space-y-3 text-sm">
              <p><strong>LinkedIn:</strong> {person.linkedin_url ? <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a> : '-'}</p>
              <p><strong>Email:</strong> {person.email || '-'}</p>
              <p><strong>Phone:</strong> {person.phone || '-'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Follow-ups</h2>
            <form onSubmit={handleAddFollowup} className="flex gap-2 mb-4">
              <Input 
                type="date" 
                value={newFollowupDate} 
                onChange={(e) => setNewFollowupDate(e.target.value)}
                required
              />
              <Button type="submit" size="sm">Set</Button>
            </form>

            <ul className="space-y-3">
              {followups.map(f => (
                <li key={f.id} className={`flex justify-between items-center text-sm p-2 rounded ${f.completed ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                  <span>{new Date(f.followup_date).toLocaleDateString()}</span>
                  {!f.completed ? (
                    <Button variant="outline" size="sm" onClick={() => handleCompleteFollowup(f.id)}>Done</Button>
                  ) : (
                    <span className="font-semibold text-xs">Completed</span>
                  )}
                </li>
              ))}
              {followups.length === 0 && <p className="text-sm text-gray-500 text-center">No follow-ups scheduled.</p>}
            </ul>
          </div>
        </div>

        {/* Notes Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Conversation Notes</h2>
            
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="note">Add new note</Label>
                <textarea 
                  id="note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Messaged on LinkedIn regarding software engineer role..."
                  required
                />
              </div>
              <Button type="submit">Save Note</Button>
            </form>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notes recorded yet. Add one above.</p>
              ) : (
                <ul className="space-y-3">
                  {notes.map(note => (
                    <li key={note.id} className="text-sm bg-gray-50 p-4 rounded-lg border relative group/note">
                      <p className="whitespace-pre-wrap pr-6">{note.note}</p>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/note:opacity-100 transition-opacity"
                        title="Delete Note"
                      >
                        ✕
                      </button>
                      <span className="text-xs text-gray-400 block mt-2 text-right">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
