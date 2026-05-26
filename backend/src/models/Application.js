const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },

  status: {
    type: String,
    enum: ['saved', 'applied', 'ignored', 'won', 'lost'],
    default: 'saved'
  },

  // Gemini's scoring output — cached here so we don't re-call the API
  agent_score: { type: Number, min: 0, max: 100 },
  agent_reason: { type: String },      // plain-English explanation
  agent_scored_at: { type: Date },

  notes: { type: String },             // user's own notes
  applied_at: { type: Date },
  reminder_sent: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure one application record per user per opportunity
applicationSchema.index({ user_id: 1, opportunity_id: 1 }, { unique: true });
applicationSchema.index({ user_id: 1, status: 1 });
applicationSchema.index({ agent_score: -1 });

module.exports = mongoose.model('Application', applicationSchema);
