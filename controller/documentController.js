const Document = require("../models/documentModel");
const wrapAsync = require("../utils/wrapAsync");
const fs = require('fs');
const path = require('path');

// GET /documents - Show all documents
const renderDocumentShow = wrapAsync(async (req, res) => {
    let query = {};
    const { category } = req.query;
    
    // Filter documents based on user role
    if (req.user.role === 'user') {
        // Students see only public documents
        query.isPublic = true;
    }
    
    // Add category filter if specified
    if (category && category !== 'all') {
        query.category = category;
    }
    
    const documents = await Document.find(query)
        .populate('uploadedBy', 'username')
        .sort({ createdAt: -1 });

    res.render("common/documentShow", {
        documents,
        currentUser: req.user,
        selectedCategory: category || 'all'
    });
});

// GET /documents/upload - Show upload form
const renderDocumentForm = (req, res) => {
    res.render("common/documentForm", {
        document: null,
        isEdit: false
    });
};

// POST /documents - Upload new document
const uploadDocument = wrapAsync(async (req, res) => {
    if (!req.file) {
        req.flash("error", "Please select a file to upload.");
        return res.redirect("/api/documents/upload");
    }

    const documentData = {
        ...req.validatedDocument,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user._id
    };

    const newDocument = new Document(documentData);
    await newDocument.save();

    req.flash("success", "Document uploaded successfully!");
    res.redirect("/api/documents");
});

// GET /documents/:id/edit - Show edit form
const renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
        req.flash("error", "Document not found!");
        return res.redirect("/api/documents");
    }

    // Check if user can edit this document
    if (req.user.role === 'faculty' && !document.uploadedBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own documents!");
        return res.redirect("/api/documents");
    }

    res.render("common/documentForm", {
        document,
        isEdit: true
    });
});

// PUT /documents/:id - Update document
const updateDocument = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
        req.flash("error", "Document not found!");
        return res.redirect("/api/documents");
    }

    // Check if user can edit this document
    if (req.user.role === 'faculty' && !document.uploadedBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own documents!");
        return res.redirect("/api/documents");
    }

    // If new file is uploaded, delete old file and update
    if (req.file) {
        // Delete old file from local storage
        const oldFilePath = path.join(__dirname, '../public', document.filePath);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }
        
        // Update with new file data
        req.validatedDocument.fileName = req.file.originalname;
        req.validatedDocument.filePath = `/uploads/${req.file.filename}`;
        req.validatedDocument.fileType = req.file.mimetype;
        req.validatedDocument.fileSize = req.file.size;
    }

    await Document.findByIdAndUpdate(id, req.validatedDocument);
    req.flash("success", "Document updated successfully!");
    res.redirect("/api/documents");
});

// DELETE /documents/:id - Delete document
const deleteDocument = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
        req.flash("error", "Document not found!");
        return res.redirect("/api/documents");
    }

    // Check if user can delete this document
    if (req.user.role === 'faculty' && !document.uploadedBy.equals(req.user._id)) {
        req.flash("error", "You can only delete your own documents!");
        return res.redirect("/api/documents");
    }

    // Delete file from local storage
    const filePath = path.join(__dirname, '../public', document.filePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    // Delete document from database
    await Document.findByIdAndDelete(id);
    
    req.flash("success", "Document deleted successfully!");
    res.redirect("/api/documents");
});

// GET /documents/:id/download - Download document
const downloadDocument = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
        req.flash("error", "Document not found!");
        return res.redirect("/api/documents");
    }

    // Check if user can access this document
    if (req.user.role === 'user' && !document.isPublic) {
        req.flash("error", "You don't have permission to access this document!");
        return res.redirect("/api/documents");
    }

    // Serve file from local storage
    const filePath = path.join(__dirname, '../public', document.filePath);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, document.fileName);
    } else {
        req.flash("error", "File not found on server!");
        res.redirect("/api/documents");
    }
});

module.exports = {
    renderDocumentShow,
    renderDocumentForm,
    uploadDocument,
    renderEditForm,
    updateDocument,
    deleteDocument,
    downloadDocument
};