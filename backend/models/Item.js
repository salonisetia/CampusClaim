const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  contact: { type: String, required: true },
  image: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80' 
  },
  status: { type: String, enum: ['Active', 'Claimed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);