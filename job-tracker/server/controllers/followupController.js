import * as Followup from '../models/followupModel.js';
import * as Person from '../models/personModel.js';
import { logActivity } from '../models/activityModel.js';

export const createFollowup = async (req, res) => {
  try {
    const { person_id, followup_date } = req.body;
    const userId = req.user.id;

    if (!person_id || !followup_date) {
      return res.status(400).json({ message: 'Person ID and Follow-up Date are required' });
    }

    // Verify person ownership
    const person = await Person.getPersonById(person_id, userId);
    if (!person) {
      return res.status(403).json({ message: 'Not authorized to add follow-up for this person' });
    }

    const followup = await Followup.createFollowup(person_id, followup_date);
    
    // Log activity
    await logActivity(userId, `Scheduled follow-up with ${person.name}`, 'followup', followup.id);

    res.status(201).json(followup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating follow-up' });
  }
};

export const getFollowupsByPerson = async (req, res) => {
  try {
    const userId = req.user.id;
    const personId = req.params.personId;

    // Verify ownership
    const person = await Person.getPersonById(personId, userId);
    if (!person) {
      return res.status(403).json({ message: 'Not authorized to fetch follow-ups' });
    }

    const followups = await Followup.getFollowupsByPerson(personId);
    res.json(followups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching follow-ups' });
  }
};

export const completeFollowup = async (req, res) => {
  try {
    const followupId = req.params.id;

    const completed = await Followup.markFollowupComplete(followupId);
    if (!completed) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    res.json(completed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error completing follow-up' });
  }
};

export const getUpcomingFollowups = async (req, res) => {
  try {
    const userId = req.user.id;
    const followups = await Followup.getUpcomingFollowups(userId);
    res.json(followups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching upcoming followups' });
  }
};
