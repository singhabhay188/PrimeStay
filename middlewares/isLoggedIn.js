function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash('error','You must login first');
        return res.redirect('/user/login');
    }
    next();
} 

module.exports = isLoggedIn;