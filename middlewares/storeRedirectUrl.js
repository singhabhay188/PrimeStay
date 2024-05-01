function storeRedirectUrl(req,res,next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports = storeRedirectUrl;