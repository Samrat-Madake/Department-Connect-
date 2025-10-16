const Joi = require("joi");
const ExpressError = require("../utils/ExpressError"); // adjust path if needed

// =======================
// Joi Schema Definition
// =======================
const announcementSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title should be at least 3 characters long.",
    "any.required": "Title is required."
  }),

  body: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Content cannot be empty.",
    "string.min": "Content should be at least 10 characters long.",
    "any.required": "Content is required."
  }),

  targetRole: Joi.string().valid("user", "faculty", "all").required().messages({
    "any.only": "Target audience must be one of: user, faculty, or all.",
    "any.required": "Target audience is required."
  }),

  priority: Joi.string().valid("low", "medium", "high").default("low").required().messages({
    "any.only": "Priority must be one of: low, medium, or high.",
    "any.required": "Priority is required."
  }),

  // createdBy will be injected from session or token, not from form
  createdBy: Joi.string().optional()
});

// Document Schema
const documentSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title should be at least 3 characters long.",
    "any.required": "Title is required."
  }),

  description: Joi.string().max(500).optional().allow('').messages({
    "string.max": "Description should not exceed 500 characters."
  }),

  category: Joi.string().valid("syllabus", "notes", "assignments", "notices", "forms", "other").default("other").messages({
    "any.only": "Category must be one of: syllabus, notes, assignments, notices, forms, or other."
  }),

  isPublic: Joi.boolean().default(true)
});

// Leave Request Schema
const leaveRequestSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title should be at least 3 characters long.",
    "any.required": "Title is required."
  }),

  reason: Joi.string().valid("sick", "personal", "academic").required().messages({
    "any.only": "Reason must be one of: sick, personal, or academic.",
    "any.required": "Reason is required."
  }),

  fromDate: Joi.date().min('now').required().messages({
    "date.min": "From date cannot be in the past.",
    "any.required": "From date is required."
  }),

  toDate: Joi.date().min(Joi.ref('fromDate')).required().messages({
    "date.min": "To date must be after from date.",
    "any.required": "To date is required."
  }),

  classTeacher: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Class teacher name cannot be empty.",
    "string.min": "Class teacher name should be at least 2 characters long.",
    "any.required": "Class teacher name is required."
  }),

  reviewComments: Joi.string().max(500).optional().allow('').messages({
    "string.max": "Comments should not exceed 500 characters."
  })
});

module.exports = { announcementSchema, documentSchema, leaveRequestSchema };