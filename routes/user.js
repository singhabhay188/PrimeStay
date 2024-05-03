const express = require('express');
const router = express.Router();
const passport = require('passport');

const storeRedirectUrl = require('../middlewares/storeRedirectUrl');

/* Controllers */
const userController = require('../controllers/user');

router.get('/signup', userController.displaySignup);

router.post('/signup', userController.signup);

router.get('/login',(req,res)=>{
    res.render('login',{message:req.flash('error')});
})

router.post('/login', storeRedirectUrl, 
    passport.authenticate('local', { failureRedirect:'/user/login', failureFlash: true}), 
    userController.afterlogin
);

router.get('/logout', userController.logout);

module.exports = router;