const missionRepository = require('../repositories/missionRepository');
const assignmentRepository = require('../repositories/assignmentRepository');
const shipRepository = require('../repositories/shipRepository');

async function getAllMissions() {
  return missionRepository.findAll();
}

async function getMissionById(id) {
  return missionRepository.findById(id);
}

async function createMission(mission) {
  return missionRepository.create(mission);
}

function createAssignmentError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function assignSpaceshipToMission(missionId, spaceshipId) {
  try {
    return await assignmentRepository.withTransaction(async (session) => {
      const mission = await missionRepository.reserveForAssignment(missionId, session);
      if (!mission) {
        const existingMission = await missionRepository.findById(missionId, session);
        if (!existingMission) {
          throw createAssignmentError('MISSION_NOT_FOUND', 'Mission not found');
        }
        throw createAssignmentError(
          'ASSIGNMENT_CONFLICT',
          'Mission is not pending and cannot be assigned'
        );
      }

      const spaceship = await shipRepository.reserveForAssignment(spaceshipId, session);
      if (!spaceship) {
        const existingSpaceship = await shipRepository.findById(spaceshipId, session);
        if (!existingSpaceship) {
          throw createAssignmentError('SPACESHIP_NOT_FOUND', 'Spaceship not found');
        }
        throw createAssignmentError('ASSIGNMENT_CONFLICT', 'Spaceship is not available');
      }

      return assignmentRepository.create({
        missionId,
        spaceshipId,
        status: 'active'
      }, session);
    });
  } catch (error) {
    const statusByCode = {
      MISSION_NOT_FOUND: 404,
      SPACESHIP_NOT_FOUND: 404,
      ASSIGNMENT_CONFLICT: 409,
      ACTIVE_ASSIGNMENT_CONFLICT: 409
    };

    if (statusByCode[error.code]) {
      error.status = statusByCode[error.code];
      throw error;
    }

    throw error;
  }
}

module.exports = {
  getAllMissions,
  getMissionById,
  createMission,
  assignSpaceshipToMission
};
