const express = require('express');
const trackController = require('../controllers/trackController');
const router = express.Router();

router.route('/')
    .get(trackController.getTracks)
    .post(trackController.createTrack);
router.route('/:id')
    .put(trackController.updateTrack)
    .delete(trackController.deactivateTrack);
router.delete('/:id/hard', trackController.hardDeleteTrack);

module.exports = router;