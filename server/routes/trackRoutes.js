const express = require('express');
const trackController = require('../controllers/trackController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin } = require('../middleware/check-role');

router.route('/')
    .get(trackController.getTracks)
    .post(isAuth, isAdmin, trackController.createTrack);

router.route('/:id')
    .put(isAuth, isAdmin, trackController.updateTrack)
    .delete(isAuth, isAdmin, trackController.deactivateTrack);

router.delete('/:id/hard', isAuth, isAdmin, trackController.hardDeleteTrack);

module.exports = router;