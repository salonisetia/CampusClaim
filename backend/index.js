const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusclaim';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// 1. GET ALL ITEMS
app.get('/api/get_items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// 2. POST NEW ITEM
app.post('/api/post_item', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item' });
  }
});

// 3. VERIFY / TOGGLE ITEM STATUS
app.patch('/api/verify_item/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    item.status = item.status === 'Active' ? 'Claimed' : 'Active';
    const updated = await item.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
module.exports = app;