const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['hackathon', 'grant', 'freelance', 'web3', 'scholarship', 'job'],
    required: true
  },
  tags: [{ type: String }],           // e.g. ['react', 'AI', 'solidity']
  prize_or_value: { type: String },   // e.g. "$5,000" or "unpaid"
  deadline: { type: Date, required: true },
  url: { type: String, required: true },
  source: { type: String },           // e.g. "devpost", "gitcoin", "upwork"
  location: { type: String, default: 'remote' },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'any'],
    default: 'any'
  },
  is_active: { type: Boolean, default: true },
  scraped_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for fast querying
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ tags: 1 });
opportunitySchema.index({ is_active: 1, deadline: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
