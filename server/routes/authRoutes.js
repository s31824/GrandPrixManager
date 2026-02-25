const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/login', authController.login);
router.get('/users',authController.getUsers);
router.route('/users/:id')
    .put(authController.updateUser)
    .delete(authController.deleteUser);

module.exports = router;