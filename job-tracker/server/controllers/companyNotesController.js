import * as CompanyNotes from '../models/companyNotesModel.js';
import * as Company from '../models/companyModel.js';

export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const companyId = req.params.companyId;
    const userId = req.user.id;

    if (!note) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const company = await Company.getCompanyById(companyId, userId);
    if (!company) {
      return res.status(403).json({ message: 'Not authorized to add notes for this company' });
    }

    const newNote = await CompanyNotes.addCompanyNote(companyId, note);
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating company note' });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    const company = await Company.getCompanyById(companyId, userId);
    if (!company) {
      return res.status(403).json({ message: 'Not authorized to view notes' });
    }

    const notes = await CompanyNotes.getCompanyNotes(companyId);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching company notes' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await CompanyNotes.deleteCompanyNote(noteId);
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Company note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting company note' });
  }
};
