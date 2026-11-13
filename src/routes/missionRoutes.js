const express = require('express');
const missionController = require('../controllers/missionController');

const router = express.Router();

router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);
router.post('/', missionController.createMission);

module.exports = router;
