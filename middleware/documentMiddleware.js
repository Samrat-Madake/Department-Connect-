const { documentSchema } = require("../utils/schema");
const ExpressError = require("../utils/ExpressError");

function validateDocument(req, res, next) {
  const { error, value } = documentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const message = error.details.map(e => e.message).join(", ");
    req.flash("error", message);
    return res.redirect("back");
  }

  req.validatedDocument = value;
  next();
}

module.exports = { validateDocument };