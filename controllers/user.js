/* Models */
const User = require('../models/user');

module.exports.displaySignup = (req, res) => {
    res.render('signup', {message:req.flash('message')});
};

module.exports.signup = async (req, res) => {
    try{
        let {name,email,password} = req.body;
        const user = new User({email,name,username:email});
        await user.setPassword(password);   
        await user.save();
        req.login(user,(err)=>{
            if(err) return next(err);
            req.flash('message','Signed and Logged in Successfully');
            res.redirect('/listing');
        });
    }
    catch(err){
        console.log(err.message);
        if(err.code = 11000) req.flash('message', 'User already exists with such email');
        else req.flash('message', 'Problem in registeration');
        res.redirect('/user/signup');
    }
};

module.exports.displayLogin = (req, res) => {
    res.render('login',{message:req.flash('error')});
};

module.exports.afterlogin = (req, res) => {
    let url = res.locals.redirectUrl;
    if(url){
        console.log(res.locals?.redirectUrl);
        return res.redirect(url);
    }
    req.flash('message','Logged in Successfully');
    res.redirect('/listing');
};

module.exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if(err){
            console.log(err);
            next(err);
        }

        req.flash('message','Succesfully Logged Out');
        res.redirect('/listing');
    })
};