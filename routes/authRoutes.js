const express = require('express');
const router = express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware/saveRedirectUrl.js");

const userController = require('../controller/user.js');

// base url → /api/auth
router.get("/signUp", userController.renderSignUp);

router.post("/signUp", wrapAsync(userController.signUp));


router.get("/login", userController.renderLogin);

router.post("/login", saveRedirectUrl,
  passport.authenticate("local", {
      failureRedirect: "/api/auth/login",
      failureFlash: true
    }),
    userController.login 
  );
  
  router.get("/logout", userController.logout);
  
  // ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  //

module.exports = router;  