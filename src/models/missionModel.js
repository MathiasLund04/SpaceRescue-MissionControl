const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  destination: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in progress', 'complete']
  }
}, {
  collection: 'missions'
});

module.exports = mongoose.model('Mission', missionSchema);
