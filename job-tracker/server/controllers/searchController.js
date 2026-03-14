import * as Search from '../models/searchModel.js';

export const globalSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q;

    if (!query) {
      return res.json({ companies: [], jobs: [], people: [] });
    }

    const results = await Search.searchAll(userId, query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error performing search' });
  }
};
