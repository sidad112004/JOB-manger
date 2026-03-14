import * as Person from '../models/personModel.js';
import * as Company from '../models/companyModel.js';

export const createPerson = async (req, res) => {
  try {
    const { company_id, name, role, linkedin_url, email, phone } = req.body;
    const userId = req.user.id;

    if (!company_id || !name) {
      return res.status(400).json({ message: 'Company ID and Name are required' });
    }

    const company = await Company.getCompanyById(company_id, userId);
    if (!company) {
      return res.status(403).json({ message: 'Not authorized to add people to this company' });
    }

    const person = await Person.createPerson(company_id, userId, name, role, linkedin_url, email, phone);
    res.status(201).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating person check' });
  }
};

export const getPeopleByCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    const people = await Person.getCompanyPeople(companyId, userId);
    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching people' });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const userId = req.user.id;
    const personId = req.params.id;

    const deletedPerson = await Person.deletePerson(personId, userId);
    
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found or unauthorized' });
    }

    res.json({ message: 'Person removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting person' });
  }
};

export const getPersonDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const personId = req.params.id;

    const person = await Person.getPersonById(personId, userId);
    if (!person) {
      return res.status(404).json({ message: 'Person not found or unauthorized' });
    }

    res.json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching person details' });
  }
};
