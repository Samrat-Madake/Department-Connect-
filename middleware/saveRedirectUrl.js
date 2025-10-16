function saveRedirectUrl(req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // Why we storing in res.locals?
        // Passport js resets session info 
    }
    next(); 
}

module.exports = { saveRedirectUrl };

// usage 
// const { saveRedirectUrl } = require('../middleware/saveRedirectUrl');
// app.use(saveRedirectUrl);