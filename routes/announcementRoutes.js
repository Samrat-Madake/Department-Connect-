const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateAnnouncement } = require('../middleware/announcementMiddleware');
const announcementController = require('../controller/announcementController');

// GET /announcements - View announcements (all roles can view)
router.get("/", verifyToken, announcementController.renderAnnouncementShow);

// GET /announcements/create - Show create form (faculty and HOD only)
router.get("/create", verifyToken, authorizeRoles("hod", "faculty"), announcementController.renderAnnouncementForm);

// POST /announcements - Create announcement (faculty and HOD only)
router.post("/", verifyToken, authorizeRoles("hod", "faculty"), validateAnnouncement, announcementController.createAnnouncement);

// GET /announcements/:id/edit - Show edit form (faculty and HOD only)
router.get("/:id/edit", verifyToken, authorizeRoles("hod", "faculty"), announcementController.renderEditForm);

// PUT /announcements/:id - Update announcement (faculty and HOD only)
router.put("/:id", verifyToken, authorizeRoles("hod", "faculty"), validateAnnouncement, announcementController.updateAnnouncement);

// DELETE /announcements/:id - Delete announcement (faculty and HOD only)
router.delete("/:id", verifyToken, authorizeRoles("hod", "faculty"), announcementController.deleteAnnouncement);

module.exports = router;