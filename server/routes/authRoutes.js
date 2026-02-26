const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin } = require('../middleware/check-role');

router.post('/signup', isAuth, isAdmin, authController.createUser);
router.post('/login', authController.login);
router.get('/users', isAuth, isAdmin, authController.getUsers);

router.route('/users/:id')
    .put(isAuth, isAdmin, authController.updateUser)
    .delete(isAuth, isAdmin, authController.deleteUser);

module.exports = router;