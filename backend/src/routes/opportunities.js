const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// GET all active opportunities (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, tags, limit = 50 } = req.query;
    const filter = {
      is_active: true,
      deadline: { $gte: new Date() }
    };
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

    const opportunities = await Opportunity.find(filter)
      .sort({ deadline: 1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: opportunities.length, data: opportunities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single opportunity
router.get('/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: opp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create opportunity (used by ingestion pipeline)
router.post('/', async (req, res) => {
  try {
    const opp = await Opportunity.create(req.body);
    res.status(201).json({ success: true, data: opp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
