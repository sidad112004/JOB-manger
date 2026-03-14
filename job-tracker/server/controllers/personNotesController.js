import * as Notes from '../models/personNotesModel.js';
import * as Person from '../models/personModel.js';

export const addNote = async (req, res) => {
  try {
    const { person_id, note } = req.body;
    const userId = req.user.id;

    if (!person_id || !note) {
      return res.status(400).json({ message: 'Person ID and Note are required' });
    }

    // Verify person ownership
    const person = await Person.getPersonById(person_id, userId);
    if (!person) {
      return res.status(403).json({ message: 'Not authorized to add notes for this person' });
    }

    const newNote = await Notes.addNote(person_id, note);
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating note' });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const personId = req.params.personId;

    // Verify ownership
    const person = await Person.getPersonById(personId, userId);
    if (!person) {
      return res.status(403).json({ message: 'Not authorized to fetch notes for this person' });
    }

    const notes = await Notes.getPersonNotes(personId);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    // Note: for production you might want to verify the note belongs to the user,
    // but the task assumes simple delete for now.
    const noteId = req.params.id;
    const deletedNote = await Notes.deleteNote(noteId);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting note' });
  }
};
