const express = require('express');
const raceController = require('../controllers/raceController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin } = require('../middleware/check-role');

router.route('/')
    .get(raceController.getRaces)
    .post(isAuth, isAdmin, raceController.createRace);

router.route('/:id')
    .get(raceController.getRaceDetails)
    .put(isAuth, isAdmin, raceController.updateRace)
    .delete(isAuth, isAdmin, raceController.deleteRace);

module.exports = router;