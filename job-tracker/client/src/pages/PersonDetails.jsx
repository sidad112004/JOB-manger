import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import {
  ArrowLeft, Send, Linkedin, Mail, Phone, CalendarDays,
  CheckCircle2, Clock, Building2, UserCircle2, Trash2, Pencil, Check
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [notes, setNotes] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newNote, setNewNote] = useState('');
  const [newFollowupDate, setNewFollowupDate] = useState('');

  // ── Edit person state ────────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', role: '', linkedin_url: '', email: '', phone: ''
  });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const [personRes, notesRes, followupsRes] = await Promise.all([
        axios.get(`${API_URL}/api/people/${id}`, { headers }),
        axios.get(`${API_URL}/api/person-notes/${id}`, { headers }),
        axios.get(`${API_URL}/api/followups/person/${id}`, { headers })
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

  // Pre-fill edit form when person loads
  useEffect(() => {
    if (person) {
      setEditForm({
        name: person.name || '',
        role: person.role || '',
        linkedin_url: person.linkedin_url || '',
        email: person.email || '',
        phone: person.phone || '',
      });
    }
  }, [person]);

  // ── Edit person ──────────────────────────────────────────────
  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditPerson = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) { setEditError('Name is required'); return; }
    setEditSaving(true);
    setEditError('');
    try {
      await axios.put(
        `${API_URL}/api/people/${id}`,
        editForm,
        { headers: getHeaders() }
      );
      await fetchData();
      setIsEditOpen(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update person');
    }
    setEditSaving(false);
  };

  // ── Notes ────────────────────────────────────────────────────
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    await axios.post(
      `${API_URL}/api/person-notes`,
      { person_id: id, note: newNote },
      { headers: getHeaders() }
    );
    setNewNote('');
    fetchData();
  };

  const handleDeleteNote = async (noteId) => {
    await axios.delete(
      `${API_URL}/api/person-notes/${noteId}`,
      { headers: getHeaders() }
    );
    fetchData();
  };

  // ── Follow-ups ───────────────────────────────────────────────
  const handleAddFollowup = async (e) => {
    e.preventDefault();
    if (!newFollowupDate) return;
    await axios.post(
      `${API_URL}/api/followups`,
      { person_id: id, followup_date: newFollowupDate },
      { headers: getHeaders() }
    );
    setNewFollowupDate('');
    fetchData();
  };

  const handleCompleteFollowup = async (followupId) => {
    await axios.patch(
      `${API_URL}/api/followups/${followupId}/complete`,
      {},
      { headers: getHeaders() }
    );
    fetchData();
  };

  // ── Render states ────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">Loading…</p>
    </div>
  );

  if (!person) return (
    <div className="p-8 text-center text-red-500 text-sm">Person not found.</div>
  );

  const today = new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(`/company/${person.company_id}`)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate">{person.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <Building2 className="h-3 w-3" />
            {person.role || 'Unspecified Role'}
          </p>
        </div>

        {/* ── Edit Person Dialog ──────────────────────────── */}
        <Dialog
          open={isEditOpen}
          onOpenChange={(open) => { setIsEditOpen(open); setEditError(''); }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditPerson} className="space-y-3 mt-2">
              {editError && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {editError}
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-role">Role / Title</Label>
                <Input
                  id="edit-role"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  placeholder="e.g. Engineering Manager"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
                <Input
                  id="edit-linkedin"
                  name="linkedin_url"
                  value={editForm.linkedin_url}
                  onChange={handleEditChange}
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  type="email"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  type="tel"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" className="flex-1 gap-1.5" disabled={editSaving}>
                  {editSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <><Check className="h-3.5 w-3.5" /> Save Changes</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Main grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ── Left column ──────────────────────────────────── */}
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
                <p className="text-xs text-gray-500">{person.role || 'No role specified'}</p>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Linkedin className="h-4 w-4 text-blue-500 shrink-0" />
                  {person.linkedin_url ? (
                    <a
                      href={person.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs truncate"
                    >
                      LinkedIn Profile
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Not provided</span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-xs truncate">
                    {person.email || <span className="text-gray-400 italic">Not provided</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-xs">
                    {person.phone || <span className="text-gray-400 italic">Not provided</span>}
                  </span>
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
              <Input
                type="date"
                value={newFollowupDate}
                onChange={e => setNewFollowupDate(e.target.value)}
                required
                className="h-8 text-sm bg-gray-50 flex-1"
                min={new Date().toISOString().split('T')[0]}
              />
              <Button type="submit" size="sm" className="h-8 px-3 shrink-0">Set</Button>
            </form>

            {followups.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                No follow-ups scheduled.
              </p>
            ) : (
              <ul className="space-y-2">
                {followups.map(f => {
                  const isOverdue = !f.completed && new Date(f.followup_date) < new Date(new Date().setHours(0, 0, 0, 0));
                  return (
                    <li
                      key={f.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${f.completed ? 'bg-green-50 border-green-100 text-green-700'
                        : isOverdue ? 'bg-red-50 border-red-100 text-red-700'
                          : 'bg-orange-50 border-orange-100 text-orange-700'
                        }`}
                    >
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

        {/* ── Notes column ─────────────────────────────────── */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-14rem)] max-h-[700px]">

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
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddNote(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  className="h-11 w-11 rounded-xl p-0 shrink-0 shadow-sm"
                  disabled={!newNote.trim()}
                >
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