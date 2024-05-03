const express = require('express');
const router = express.Router();
const passport = require('passport');

const storeRedirectUrl = require('../middlewares/storeRedirectUrl');

/* Controllers */
const userController = require('../controllers/user');

router.route('/signup')
    .get(userController.displaySignup)
    .post(userController.signup);

router.route('/login')
    .get(userController.displayLogin)
    .post(storeRedirectUrl, passport.authenticate('local', { failureRedirect:'/user/login', failureFlash: true}), userController.afterlogin);

router.get('/logout', userController.logout);

module.exports = router;