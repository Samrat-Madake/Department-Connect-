const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  location: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().allow("", null),
  country: Joi.string().min(2).max(100).required()
});

const reviewSchema = Joi.object({
  comment: Joi.string()
    .min(4)
    .max(500)
    .regex(/^(?=.*[A-Za-z])[A-Za-z0-9\s.,!?'"()-]+$/) 
    .required()
    .messages({
      "string.pattern.base": "Comment must include at least one letter and only valid characters."
    }),
  rating: Joi.number().min(1).max(5).required()
});


module.exports = { listingSchema, reviewSchema };
