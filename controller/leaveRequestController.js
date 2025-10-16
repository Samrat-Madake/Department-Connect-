const LeaveRequest = require("../models/leaveRequestModel");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const fs = require('fs');
const path = require('path');

// GET /leave-requests - Show all leave requests
const renderLeaveRequestShow = wrapAsync(async (req, res) => {
    let query = {};
    const { status } = req.query;
    
    // Filter leave requests based on user role
    if (req.user.role === 'user') {
        // Students see only their own requests
        query.requestedBy = req.user._id;
    } else if (req.user.role === 'faculty') {
        // Faculty see requests where they are the class teacher
        query.classTeacher = req.user.username;
    }
    // HOD sees all requests (no additional filter)
    
    // Add status filter if specified
    if (status && status !== 'all') {
        query.status = status;
    }
    
    const leaveRequests = await LeaveRequest.find(query)
        .populate('requestedBy', 'username')
        .populate('reviewedBy', 'username')
        .sort({ createdAt: -1 });

    res.render("common/leaveRequestShow", {
        leaveRequests,
        currentUser: req.user,
        selectedStatus: status || 'all'
    });
});

// GET /leave-requests/create - Show create form (students only)
const renderLeaveRequestForm = (req, res) => {
    res.render("common/leaveRequestForm", {
        leaveRequest: null,
        isEdit: false
    });
};

// POST /leave-requests - Create new leave request
const createLeaveRequest = wrapAsync(async (req, res) => {
    const leaveRequestData = {
        ...req.validatedLeaveRequest,
        requestedBy: req.user._id
    };

    // Handle file attachment if uploaded
    if (req.file) {
        leaveRequestData.attachmentPath = `/uploads/${req.file.filename}`;
        leaveRequestData.attachmentName = req.file.originalname;
    }

    const newLeaveRequest = new LeaveRequest(leaveRequestData);
    await newLeaveRequest.save();

    req.flash("success", "Leave request submitted successfully!");
    res.redirect("/api/leave-requests");
});

// GET /leave-requests/:id/edit - Show edit form (students only, pending requests)
const renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    // Check if user can edit this request
    if (!leaveRequest.requestedBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own leave requests!");
        return res.redirect("/api/leave-requests");
    }

    if (leaveRequest.status !== 'pending') {
        req.flash("error", "You can only edit pending leave requests!");
        return res.redirect("/api/leave-requests");
    }

    res.render("common/leaveRequestForm", {
        leaveRequest,
        isEdit: true
    });
});

// PUT /leave-requests/:id - Update leave request
const updateLeaveRequest = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    // Check if user can edit this request
    if (!leaveRequest.requestedBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own leave requests!");
        return res.redirect("/api/leave-requests");
    }

    if (leaveRequest.status !== 'pending') {
        req.flash("error", "You can only edit pending leave requests!");
        return res.redirect("/api/leave-requests");
    }

    // Handle new file attachment
    if (req.file) {
        // Delete old file if exists
        if (leaveRequest.attachmentPath) {
            const oldFilePath = path.join(__dirname, '../public', leaveRequest.attachmentPath);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
        
        req.validatedLeaveRequest.attachmentPath = `/uploads/${req.file.filename}`;
        req.validatedLeaveRequest.attachmentName = req.file.originalname;
    }

    await LeaveRequest.findByIdAndUpdate(id, req.validatedLeaveRequest);
    req.flash("success", "Leave request updated successfully!");
    res.redirect("/api/leave-requests");
});

// DELETE /leave-requests/:id - Delete leave request
const deleteLeaveRequest = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    // Check if user can delete this request
    if (!leaveRequest.requestedBy.equals(req.user._id)) {
        req.flash("error", "You can only delete your own leave requests!");
        return res.redirect("/api/leave-requests");
    }

    if (leaveRequest.status !== 'pending') {
        req.flash("error", "You can only delete pending leave requests!");
        return res.redirect("/api/leave-requests");
    }

    // Delete attachment file if exists
    if (leaveRequest.attachmentPath) {
        const filePath = path.join(__dirname, '../public', leaveRequest.attachmentPath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
    await LeaveRequest.findByIdAndDelete(id);
    req.flash("success", "Leave request deleted successfully!");
    res.redirect("/api/leave-requests");
});

// POST /leave-requests/:id/approve - Approve leave request (faculty/HOD only)
const approveLeaveRequest = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { reviewComments } = req.body;
    
    const leaveRequest = await LeaveRequest.findById(id).populate('requestedBy', 'username');

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    if (leaveRequest.status !== 'pending') {
        req.flash("error", "This leave request has already been reviewed!");
        return res.redirect("/api/leave-requests");
    }

    // Check if faculty is the assigned class teacher or if user is HOD
    if (req.user.role === 'faculty' && leaveRequest.classTeacher !== req.user.username) {
        req.flash("error", "You can only review requests assigned to you!");
        return res.redirect("/api/leave-requests");
    }

    await LeaveRequest.findByIdAndUpdate(id, {
        status: 'approved',
        reviewedBy: req.user._id,
        reviewDate: new Date(),
        reviewComments: reviewComments || null
    });

    req.flash("success", `Leave request approved for ${leaveRequest.requestedBy.username}!`);
    res.redirect("/api/leave-requests");
});

// POST /leave-requests/:id/reject - Reject leave request (faculty/HOD only)
const rejectLeaveRequest = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { reviewComments } = req.body;
    
    const leaveRequest = await LeaveRequest.findById(id).populate('requestedBy', 'username');

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    if (leaveRequest.status !== 'pending') {
        req.flash("error", "This leave request has already been reviewed!");
        return res.redirect("/api/leave-requests");
    }

    // Check if faculty is the assigned class teacher or if user is HOD
    if (req.user.role === 'faculty' && leaveRequest.classTeacher !== req.user.username) {
        req.flash("error", "You can only review requests assigned to you!");
        return res.redirect("/api/leave-requests");
    }

    await LeaveRequest.findByIdAndUpdate(id, {
        status: 'rejected',
        reviewedBy: req.user._id,
        reviewDate: new Date(),
        reviewComments: reviewComments || null
    });

    req.flash("success", `Leave request rejected for ${leaveRequest.requestedBy.username}!`);
    res.redirect("/api/leave-requests");
});

// GET /leave-requests/:id/download - Download attachment
const downloadAttachment = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
        req.flash("error", "Leave request not found!");
        return res.redirect("/api/leave-requests");
    }

    if (!leaveRequest.attachmentPath) {
        req.flash("error", "No attachment found!");
        return res.redirect("/api/leave-requests");
    }

    // Check if user can access this attachment
    const canAccess = leaveRequest.requestedBy.equals(req.user._id) || 
                     req.user.role === 'hod' || 
                     (req.user.role === 'faculty' && leaveRequest.classTeacher === req.user.username);

    if (!canAccess) {
        req.flash("error", "You don't have permission to access this attachment!");
        return res.redirect("/api/leave-requests");
    }

    const filePath = path.join(__dirname, '../public', leaveRequest.attachmentPath);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, leaveRequest.attachmentName);
    } else {
        req.flash("error", "Attachment file not found on server!");
        res.redirect("/api/leave-requests");
    }
});

module.exports = {
    renderLeaveRequestShow,
    renderLeaveRequestForm,
    createLeaveRequest,
    renderEditForm,
    updateLeaveRequest,
    deleteLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    downloadAttachment
};