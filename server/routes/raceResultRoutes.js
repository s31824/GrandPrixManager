const express = require('express');
const raceResultController = require('../controllers/raceResultController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin } = require('../middleware/check-role');

router.route('/:id')
    .put(isAuth, isAdmin, raceResultController.updateResult)
    .delete(isAuth, isAdmin, raceResultController.deleteResult);

router.post('/', isAuth, isAdmin, raceResultController.addResult);

router.get('/race/:raceId', raceResultController.getResultsByRace);
router.get('/driver/:driverId', raceResultController.getResultsByDriver);

module.exports = router;