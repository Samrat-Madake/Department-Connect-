function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectUrl = req.originalUrl; // save the url they are requesting
    req.flash("error", "You must be signed in first!");
    res.redirect("/login");
}

module.exports = isLoggedIn;