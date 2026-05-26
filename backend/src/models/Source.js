const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "Devpost"
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['rss', 'api', 'scraper'],
    required: true
  },
  category: { type: String },               // what kind of opps this source has
  is_active: { type: Boolean, default: true },
  last_scraped: { type: Date },
  scrape_count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Source', sourceSchema);
