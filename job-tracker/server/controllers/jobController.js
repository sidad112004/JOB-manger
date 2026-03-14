import * as Job from '../models/jobModel.js';
import * as Company from '../models/companyModel.js';

export const createJob = async (req, res) => {
  try {
    const { company_id, role, job_link, location, applied_date, status, notes } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!company_id || !role || !status) {
      return res.status(400).json({ message: 'Company ID, Role, and Status are required' });
    }

    // Optional: Verify the user owns this company first before applying a job to it.
    const company = await Company.getCompanyById(company_id, userId);
    if (!company) {
      return res.status(403).json({ message: 'Not authorized to add jobs to this company' });
    }

    const job = await Job.createJob(company_id, userId, role, job_link, location, applied_date, status, notes);
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating job application' });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    const jobs = await Job.getCompanyJobs(companyId, userId);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { status } = req.body;

    if (!status) {
       return res.status(400).json({ message: 'Missing status property' });
    }

    const updatedJob = await Job.updateJobStatus(jobId, userId, status);
    
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating job status' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const deletedJob = await Job.deleteJob(jobId, userId);
    
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json({ message: 'Job application removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
};
