import * as Company from '../models/companyModel.js';
import { logActivity } from '../models/activityModel.js';

export const createCompany = async (req, res) => {
  try {
    const { name, website, notes } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const company = await Company.createCompany(userId, name, website, notes);
    await logActivity(userId, `Added company ${name}`, 'company', company.id);

    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating company' });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const companies = await Company.getUserCompanies(userId);
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching companies' });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const company = await Company.getCompanyById(companyId, userId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching company' });
  }
};

// ── UPDATE company name / website / notes ──────────────────────
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;
    const { name, website, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const updated = await Company.updateCompany(companyId, userId, { name, website, notes });

    if (!updated) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    await logActivity(userId, `Updated company ${name}`, 'company', companyId);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating company' });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const deletedCompany = await Company.deleteCompany(companyId, userId);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    res.json({ message: 'Company removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting company' });
  }
};