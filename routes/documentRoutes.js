const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { validateDocument } = require('../middleware/documentMiddleware');
const { upload } = require('../config/localStorage');
const documentController = require('../controller/documentController');

// GET /documents - View documents (all roles can view)
router.get("/", verifyToken, documentController.renderDocumentShow);

// GET /documents/upload - Show upload form (faculty and HOD only)
router.get("/upload", verifyToken, authorizeRoles("hod", "faculty"), documentController.renderDocumentForm);

// POST /documents - Upload document (faculty and HOD only)
router.post("/", verifyToken, authorizeRoles("hod", "faculty"), upload.single('document'), validateDocument, documentController.uploadDocument);

// GET /documents/:id/edit - Show edit form (faculty and HOD only)
router.get("/:id/edit", verifyToken, authorizeRoles("hod", "faculty"), documentController.renderEditForm);

// PUT /documents/:id - Update document (faculty and HOD only)
router.put("/:id", verifyToken, authorizeRoles("hod", "faculty"), upload.single('document'), validateDocument, documentController.updateDocument);

// DELETE /documents/:id - Delete document (faculty and HOD only)
router.delete("/:id", verifyToken, authorizeRoles("hod", "faculty"), documentController.deleteDocument);

// GET /documents/:id/download - Download document (all roles)
router.get("/:id/download", verifyToken, documentController.downloadDocument);

module.exports = router;