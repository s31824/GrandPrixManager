const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin, isTeamOwner } = require('../middleware/check-role');

router.route('/')
    .get(driverController.getDrivers)
    .post(isAuth, isTeamOwner, driverController.createDriver);

router.route('/:id')
    .get(driverController.getDriverDetails)
    .put(isAuth, isTeamOwner, driverController.updateDriver)
    .delete(isAuth, isTeamOwner, driverController.deactivateDriver);

router.delete('/:id/hard', isAuth, isAdmin, driverController.hardDeleteDriver);
router.put('/:id/restore', isAuth, isAdmin, driverController.restoreDriver);

module.exports = router;