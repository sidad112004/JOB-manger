import * as Dashboard from '../models/dashboardModel.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Dashboard.getDashboardStats(userId);
    
    // Convert string counts to numbers
    const formattedStats = {
      total_companies: parseInt(stats.total_companies || 0),
      total_jobs: parseInt(stats.total_jobs || 0),
      interviews: parseInt(stats.interviews || 0),
      offers: parseInt(stats.offers || 0),
      rejections: parseInt(stats.rejections || 0)
    };
    
    res.json(formattedStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

export const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activity = await Dashboard.getJobActivity(userId);
    
    const formattedActivity = activity.map(item => ({
      date: new Date(item.date).toISOString().split('T')[0],
      count: parseInt(item.count)
    }));
    
    res.json(formattedActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching activity' });
  }
};
