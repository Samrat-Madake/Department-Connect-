const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateLeaveRequest } = require('../middleware/leaveRequestMiddleware');
const { upload } = require('../config/localStorage');
const leaveRequestController = require('../controller/leaveRequestController');

// GET /leave-requests - View leave requests (all roles)
router.get("/", verifyToken, leaveRequestController.renderLeaveRequestShow);

// GET /leave-requests/create - Show create form (students only)
router.get("/create", verifyToken, authorizeRoles("user"), leaveRequestController.renderLeaveRequestForm);

// POST /leave-requests - Create leave request (students only)
router.post("/", verifyToken, authorizeRoles("user"), upload.single('attachment'), validateLeaveRequest, leaveRequestController.createLeaveRequest);

// GET /leave-requests/:id/edit - Show edit form (students only)
router.get("/:id/edit", verifyToken, authorizeRoles("user"), leaveRequestController.renderEditForm);

// PUT /leave-requests/:id - Update leave request (students only)
router.put("/:id", verifyToken, authorizeRoles("user"), upload.single('attachment'), validateLeaveRequest, leaveRequestController.updateLeaveRequest);

// DELETE /leave-requests/:id - Delete leave request (students only)
router.delete("/:id", verifyToken, authorizeRoles("user"), leaveRequestController.deleteLeaveRequest);

// POST /leave-requests/:id/approve - Approve leave request (faculty and HOD only)
router.post("/:id/approve", verifyToken, authorizeRoles("hod", "faculty"), leaveRequestController.approveLeaveRequest);

// POST /leave-requests/:id/reject - Reject leave request (faculty and HOD only)
router.post("/:id/reject", verifyToken, authorizeRoles("hod", "faculty"), leaveRequestController.rejectLeaveRequest);

// GET /leave-requests/:id/download - Download attachment (authorized users only)
router.get("/:id/download", verifyToken, leaveRequestController.downloadAttachment);

module.exports = router;