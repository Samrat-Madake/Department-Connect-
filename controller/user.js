const User = require('../models/user');

// Render Sign Up Form
module.exports.renderSignUp = (req, res) => {
  res.render("auth/signup");  // ✅ relative path, no starting slash
};


// Sign Up Logic
module.exports.signUp =  async (req, res) => {

  try {
    const { email, username, password, role } = req.body;
    let newUser = new User({ email, username, role });

    // Register the user
    const registeredUser = await User.register(newUser, password);
    console.log("User registered successfully:", registeredUser);

    // redirect to login page with success message
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/api/auth/login");

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/api/auth/signUp");
  }

};

///// Login 
// Render Login Form
module.exports.renderLogin = (req, res) => {
  res.render("auth/login");   // ✅ relative path, no starting slash
};


// Login Logic
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back, " + req.user.username + "!");
    
    let redirectUrl;
    
    // Based on role of user -> redirect to different pages
    if (req.user.role === "hod") {
        redirectUrl = "/hod/dashboard"; // HOD dashboard
    } else if (req.user.role === "user") {
        redirectUrl = "/user/dashboard"; // User dashboard
    } else if (req.user.role === "faculty") {
        redirectUrl = "/faculty/dashboard"; // Faculty dashboard
    } else {
        redirectUrl = "/landing"; // Default redirect
    }

    // Use saved redirect URL if it exists, otherwise use role-based redirect
    const finalRedirectUrl = req.session.redirectUrl || redirectUrl;
    delete req.session.redirectUrl; // Clear the saved URL
    
    res.redirect(finalRedirectUrl);
};

  // Logout Logic
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("success", "Logged out successfully!");
    res.redirect("/landing");
  });
};



