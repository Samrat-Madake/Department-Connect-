const { leaveRequestSchema } = require("../utils/schema");
const ExpressError = require("../utils/ExpressError");

function validateLeaveRequest(req, res, next) {
  const { error, value } = leaveRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const message = error.details.map(e => e.message).join(", ");
    req.flash("error", message);
    return res.redirect("back");
  }

  req.validatedLeaveRequest = value;
  next();
}

module.exports = { validateLeaveRequest };