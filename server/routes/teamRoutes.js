const express = require('express');
const teamController = require('../controllers/teamController');
const router = express.Router();

router.route('/')
    .get(teamController.getTeams)
    .post(teamController.createTeam);
router.route('/:id')
    .get(teamController.getTeamDetails)
    .put(teamController.updateTeam)
    .delete(teamController.deactivateTeam);
router.delete('/:id/hard', teamController.hardDeleteTeam);

module.exports = router;