// Authentication middleware - checks if user is logged in
function verifyToken(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    res.redirect("/api/auth/login");
}

module.exports = verifyToken;