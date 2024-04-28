const express = require('express');
const router = express.Router();

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
        res.send(`registeration succesfull ${name}`);
    }
    catch(err){
        console.log(err.message);
        if(err.code = 11000) req.flash('message', 'User already exists with such email');
        else req.flash('message', 'Problem in registeration');
        res.redirect('/user/signup');
    }
});

module.exports = router;