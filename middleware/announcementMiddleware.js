const { announcementSchema } = require("../utils/schema");
const ExpressError = require("../utils/ExpressError");

function validateAnnouncement(req, res, next) {
  const { error, value } = announcementSchema.validate(req.body, {
    abortEarly: false,   // show all validation errors
    stripUnknown: true,  // remove fields not in schema
    convert: true        // auto-type conversion
  });

  console.log("🧾 Sanitized Announcement Data:", value);

  if (error) {
    const message = error.details.map(e => e.message).join(", ");
    req.flash("error", message);
    return res.redirect("back");
  }

  req.validatedAnnouncement = value;
  next();
}

module.exports = { validateAnnouncement };