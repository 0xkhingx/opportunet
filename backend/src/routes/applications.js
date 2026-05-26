const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// GET all applications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const apps = await Application.find({ user_id: req.params.userId })
      .populate('opportunity_id')
      .sort({ agent_score: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST save/track an opportunity for a user
router.post('/', async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update status (saved → applied → won etc.)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { status };
    if (notes) update.notes = notes;
    if (status === 'applied') update.applied_at = new Date();

    const app = await Application.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
