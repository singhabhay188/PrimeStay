const express = require('express');
const router = express.Router();

const passport = require('passport');

/* Models */
const User = require('../models/user');

router.get('/signup', (req, res) => {
    res.render('signup', {message:req.flash('message')});
});

router.post('/signup', async (req, res) => {
    try{
        let {name,email,password} = req.body;
        const user = new User({email,name,username:email});
        await user.setPassword(password);   
        await user.save();
        req.flash('message','User registered successfully. Please login to continue');
        res.redirect('/user/login');
    }
    catch(err){
        console.log(err.message);
        if(err.code = 11000) req.flash('message', 'User already exists with such email');
        else req.flash('message', 'Problem in registeration');
        res.redirect('/user/signup');
    }
});

router.get('/login',(req,res)=>{
    res.render('login',{message:req.flash('error')});
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect:'/user/login', failureFlash: true}),
  function(req, res) {
    req.flash('message','Logged in Successfully');
    res.redirect('/listing');
});

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
            next(err);
        }

        req.flash('message','Succesfully Logged Out');
        res.redirect('/listing');
    })
})

module.exports = router;