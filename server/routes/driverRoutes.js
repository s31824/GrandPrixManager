const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();

router.route('/')
    .get(driverController.getDrivers)
    .post(driverController.createDriver);
router.route('/:id')
    .get(driverController.getDriverDetails)
    .put(driverController.updateDriver)
    .delete(driverController.deactivateDriver);
router.delete('/:id/hard', driverController.hardDeleteDriver);

module.exports = router;