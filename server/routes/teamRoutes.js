const express = require('express');
const teamController = require('../controllers/teamController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin, isTeamOwner } = require('../middleware/check-role');

router.route('/')
    .get(teamController.getTeams)
    .post(isAuth, isAdmin, teamController.createTeam);

router.route('/:teamId')
    .get(teamController.getTeamDetails)
    .put(isAuth, isTeamOwner, teamController.updateTeam)
    .delete(isAuth, isAdmin, teamController.deactivateTeam);

router.delete('/:teamId/hard', isAuth, isAdmin, teamController.hardDeleteTeam);
router.put('/:teamId/restore', isAuth, isAdmin, teamController.restoreTeam);

module.exports = router;