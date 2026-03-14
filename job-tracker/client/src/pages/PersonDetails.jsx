import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, Linkedin, Mail, Phone, CalendarDays, CheckCircle2, Clock, Building2, UserCircle2, Trash2 } from 'lucide-react';

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

  useEffect(() => { fetchData(); }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/person-notes', { person_id: id, note: newNote }, { headers: { Authorization: `Bearer ${token}` } });
    setNewNote('');
    fetchData();
  };

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/person-notes/${noteId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!newFollowupDate) return;
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/followups', { person_id: id, followup_date: newFollowupDate }, { headers: { Authorization: `Bearer ${token}` } });
    setNewFollowupDate('');
    fetchData();
  };

  const handleCompleteFollowup = async (followupId) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:5000/api/followups/${followupId}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading…</p>
    </div>
  );

  if (!person) return <div className="p-8 text-center text-red-500 text-sm">Person not found.</div>;

  const today = new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(`/company/${person.company_id}`)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{person.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <Building2 className="h-3 w-3" /> {person.role || 'Unspecified Role'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="md:col-span-4 space-y-4">
          {/* Contact card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-16" />
            <div className="px-5 pb-5">
              <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center -mt-8 border-4 border-white shadow-sm mx-auto">
                {person.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center mt-2 mb-5">
                <p className="font-semibold text-gray-900">{person.name}</p>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Linkedin className="h-4 w-4 text-blue-500 shrink-0" />
                  {person.linkedin_url
                    ? <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate">LinkedIn Profile</a>
                    : <span className="text-gray-400 text-xs italic">Not provided</span>}
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-xs truncate">{person.email || <span className="text-gray-400 italic">Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-xs">{person.phone || <span className="text-gray-400 italic">Not provided</span>}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-ups card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Follow-ups</h2>
            </div>

            <form onSubmit={handleAddFollowup} className="flex gap-2 mb-4">
              <Input type="date" value={newFollowupDate} onChange={e => setNewFollowupDate(e.target.value)} required className="h-8 text-sm bg-gray-50" />
              <Button type="submit" size="sm" className="h-8 px-3 shrink-0">Set</Button>
            </form>

            {followups.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">No follow-ups scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {followups.map(f => {
                  const isOverdue = !f.completed && new Date(f.followup_date) < new Date(new Date().setHours(0,0,0,0));
                  return (
                    <li key={f.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${
                      f.completed ? 'bg-green-50 border-green-100 text-green-700' :
                      isOverdue   ? 'bg-red-50 border-red-100 text-red-700' :
                                    'bg-orange-50 border-orange-100 text-orange-700'}`}>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(f.followup_date).toLocaleDateString()}
                      </span>
                      {f.completed ? (
                        <span className="flex items-center gap-1 font-semibold text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> Done
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteFollowup(f.id)}
                          className="text-xs font-semibold underline underline-offset-2 hover:no-underline"
                        >
                          Mark done
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Notes column */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)] max-h-[700px]">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-900">Conversation Notes</h2>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <UserCircle2 className="h-10 w-10 mb-2 text-gray-300" />
                  <p className="text-sm">No notes yet.</p>
                  <p className="text-xs">Add your first note below.</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="flex flex-col items-end group">
                    <div className="max-w-[85%] bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm relative">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.note}</p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute -left-9 top-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow border border-gray-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 mt-1.5 px-1">
                      {new Date(note.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleAddNote} className="flex gap-2 items-end">
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="flex-1 min-h-[44px] max-h-[120px] resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  placeholder="Add a note… (Enter to send, Shift+Enter for newline)"
                  required
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(e); }
                  }}
                />
                <Button type="submit" className="h-11 w-11 rounded-xl p-0 shrink-0 shadow-sm" disabled={!newNote.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
