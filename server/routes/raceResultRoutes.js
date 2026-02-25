const express = require('express');
const raceResultController = require('../controllers/raceResultController');
const router = express.Router();

router.route('/:id')
    .put(raceResultController.updateResult)
    .delete(raceResultController.deleteResult);
router.post('/', raceResultController.addResult);
router.get('/race/:raceId', raceResultController.getResultsByRace);
router.get('/driver/:driverId', raceResultController.getResultsByDriver);

module.exports = router;