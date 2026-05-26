const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // What the agent uses to score opportunities for this user
  profile: {
    skills: [{ type: String }],        // e.g. ['React', 'Python', 'Solidity']
    interests: [{ type: String }],     // e.g. ['AI', 'Web3', 'Design']
    categories: [{ type: String }],    // preferred: ['hackathon', 'freelance']
    location: { type: String, default: 'Nigeria' },
    experience_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    bio: { type: String }              // freeform, fed to Gemini for context
  },

  // Agent learns from user behavior over time
  preferences: {
    min_score: { type: Number, default: 60 },         // only show >= this score
    deadline_buffer_days: { type: Number, default: 3 }, // hide if < 3 days left
    ignored_sources: [{ type: String }]
  },

  last_seen: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
