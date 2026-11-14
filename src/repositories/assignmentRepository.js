const mongoose = require('mongoose');
const Assignment = require('../models/assignmentModel');
let assignmentIndexesReady;

async function ensureAssignmentIndexes() {
  if (!assignmentIndexesReady) {
    assignmentIndexesReady = Assignment.createIndexes();
  }

  try {
    await assignmentIndexesReady;
  } catch (error) {
    assignmentIndexesReady = undefined;
    throw error;
  }
}

async function withTransaction(operation) {
  await ensureAssignmentIndexes();
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(operation, {
      readPreference: 'primary',
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' }
    });
  } catch (error) {
    if (error.code === 11000) {
      const conflict = new Error('Mission or spaceship already has an active assignment');
      conflict.code = 'ACTIVE_ASSIGNMENT_CONFLICT';
      throw conflict;
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

async function create(assignment, session) {
  const [createdAssignment] = await Assignment.create([assignment], { session });
  return createdAssignment;
}

module.exports = {
  withTransaction,
  create
};
