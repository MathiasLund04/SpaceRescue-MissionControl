const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  spaceshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spaceship',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'complete'],
    default: 'active'
  }
}, {
  collection: 'assignments'
});

assignmentSchema.index(
  { missionId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
    name: 'unique_active_assignment_per_mission'
  }
);
assignmentSchema.index(
  { spaceshipId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
    name: 'unique_active_assignment_per_spaceship'
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
