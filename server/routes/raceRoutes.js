const express = require('express');
const raceController = require('../controllers/raceController');
const router = express.Router();

router.route('/')
    .get(raceController.getRaces)
    .post(raceController.createRace);
router.route('/:id')
    .get(raceController.getRaceDetails)
    .put(raceController.updateRace)
    .delete(raceController.deleteRace);

module.exports = router;