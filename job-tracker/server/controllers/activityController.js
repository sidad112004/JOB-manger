import * as Activity from '../models/activityModel.js';

export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    const activities = await Activity.getRecentActivities(userId, limit);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};
