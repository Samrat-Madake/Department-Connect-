const mongoose = require("mongoose");

// MongoDB connection with better error handling
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/deptConnect", {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("💡 Please make sure MongoDB is running on your system");
    console.log("💡 You can start MongoDB with: mongod");
    // Don't exit the process, let the app run without DB for now
  }
}

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Connect to MongoDB
connectDB();
// ## MUST INCLUDE  ##//

//Import express framework to create server and handle routes
const express = require("express");

// Initialize the express app
const app = express();

// Define the port on which the server will run

// Import path module to handle file and directory paths
const path = require("path");

// Importing Passport Related Modules
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Parse incoming form data (URL-encoded) and make it available in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // if handling form-data

// Middleware to parse incoming JSON data
// Set EJS as the templating/view engine
app.set("view engine", "ejs");

// Define the directory where all view (ejs) files are located
app.set("views", path.join(__dirname, "views"));

// Serve static files like CSS, images, and JS from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Override HTTP methods using query parameters like ?_method=PUT or DELETE
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Root route for testing server — returns a simple message
app.get("/", (req, res) => {
  res.send("Server Working Noice !");
});

const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const session = require("express-session");
const flash = require("connect-flash");

// const expressLayouts = require('express-ejs-layouts');
// app.use(expressLayouts);
// app.set('layout', 'layout/boilerPlate'); // default layout path
// ## MUST INCLUDE  ##//

const sessionOptions = {
  secret: "SecretKeyForSession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // used to prevent cross-site scripting attacks
  }
}
app.use(session(sessionOptions));
app.use(flash()); // flash middleware
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  //

// Initialize Passport and use it to manage sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); // Use the local strategy for authentication

// Serialize user data to store in session
// serializeUser determines which data of the user object should be stored in the session.
// The result of the serializeUser method is attached to the session as req.session.passport.user = {}
passport.serializeUser(User.serializeUser());
// Deserialize user data from session
// deserializeUser is the counterpart of serializeUser, and is used to retrieve user data from the session.
passport.deserializeUser(User.deserializeUser());

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  //



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.use((req, res, next) => { // custom middleware to make flash messages available in all templates
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});





// Routes //

//landing page
app.get("/landing", (req, res) => {
  res.render("landing");
});

// terms and conditions page
app.get("/terms", (req, res) => {
  res.render("terms");
});


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Dashboard routes
const isLoggedIn = require("./middleware/isLoggedIn.js");

// HOD Dashboard
app.get("/hod/dashboard", isLoggedIn, (req, res) => {
  if (req.user.role !== 'hod') {
    req.flash("error", "Access denied. HOD privileges required.");
    return res.redirect("/landing");
  }
  res.render("hod/hodDashboard", { username: req.user.username });
});

// Faculty Dashboard  
app.get("/faculty/dashboard", isLoggedIn, (req, res) => {
  if (req.user.role !== 'faculty') {
    req.flash("error", "Access denied. Faculty privileges required.");
    return res.redirect("/landing");
  }
  res.render("faculty/facultyDashboard", { user: req.user });
});

// User Dashboard
app.get("/user/dashboard", isLoggedIn, (req, res) => {
  if (req.user.role !== 'user') {
    req.flash("error", "Access denied. User privileges required.");
    return res.redirect("/landing");
  }
  res.render("user/userDashboard", { username: req.user.username });
});

const announcementRoutes = require("./routes/announcementRoutes.js");
app.use("/api/announcements", announcementRoutes);

const documentRoutes = require("./routes/documentRoutes.js");
app.use("/api/documents", documentRoutes);

const leaveRequestRoutes = require("./routes/leaveRequestRoutes.js");
app.use("/api/leave-requests", leaveRequestRoutes);



// Catch-all route for undefined routes
app.use("", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  res.render("error", { status, message, });// Render error.ejs with status and message
});

// Server start
const PORT = 5000;
app.listen(PORT, () => console.log(` deptConnect Server running on port ${PORT}`));
