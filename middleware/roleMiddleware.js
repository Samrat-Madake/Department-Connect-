// Role-based authorization middleware
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            req.flash("error", "You must be logged in to access this resource.");
            return res.redirect("/api/auth/login");
        }

        if (!allowedRoles.includes(req.user.role)) {
            req.flash("error", "You don't have permission to access this resource.");
            return res.redirect("/landing");
        }

        next();
    };
}

module.exports = authorizeRoles;