const Announcement = require("../models/announcementModel");
const wrapAsync = require("../utils/wrapAsync");

// GET /announcements - Show all announcements
const renderAnnouncementShow = wrapAsync(async (req, res) => {
    let query = {};
    const { priority } = req.query;

    // Filter announcements based on user role
    if (req.user.role === 'user') {
        // Students see announcements targeted to 'user' or 'all'
        query.targetRole = { $in: ['user', 'all'] };
    }

    // Add priority filter if specified
    if (priority && priority !== 'all') {
        query.priority = priority;
    }

    const announcements = await Announcement.find(query)
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 });

    res.render("common/announcementShow", {
        announcements,
        currentUser: req.user,
        selectedPriority: priority || 'all'
    });
});

// GET /announcements/create - Show create form
const renderAnnouncementForm = (req, res) => {
    res.render("common/announcementForm", {
        announcement: null,
        isEdit: false
    });
};

// POST /announcements - Create new announcement
const createAnnouncement = wrapAsync(async (req, res) => {
    const announcementData = {
        ...req.validatedAnnouncement,
        createdBy: req.user._id
    };

    const newAnnouncement = new Announcement(announcementData);
    await newAnnouncement.save();

    req.flash("success", "Announcement created successfully!");
    res.redirect("/api/announcements");
});

// GET /announcements/:id/edit - Show edit form
const renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        req.flash("error", "Announcement not found!");
        return res.redirect("/api/announcements");
    }

    // Check if user can edit this announcement
    if (req.user.role === 'faculty' && !announcement.createdBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own announcements!");
        return res.redirect("/api/announcements");
    }

    res.render("common/announcementForm", {
        announcement,
        isEdit: true
    });
});

// PUT /announcements/:id - Update announcement
const updateAnnouncement = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        req.flash("error", "Announcement not found!");
        return res.redirect("/api/announcements");
    }

    // Check if user can edit this announcement
    if (req.user.role === 'faculty' && !announcement.createdBy.equals(req.user._id)) {
        req.flash("error", "You can only edit your own announcements!");
        return res.redirect("/api/announcements");
    }

    await Announcement.findByIdAndUpdate(id, req.validatedAnnouncement);
    req.flash("success", "Announcement updated successfully!");
    res.redirect("/api/announcements");
});

// DELETE /announcements/:id - Delete announcement
const deleteAnnouncement = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        req.flash("error", "Announcement not found!");
        return res.redirect("/api/announcements");
    }

    // Check if user can delete this announcement
    if (req.user.role === 'faculty' && !announcement.createdBy.equals(req.user._id)) {
        req.flash("error", "You can only delete your own announcements!");
        return res.redirect("/api/announcements");
    }

    await Announcement.findByIdAndDelete(id);
    req.flash("success", "Announcement deleted successfully!");
    res.redirect("/api/announcements");
});

module.exports = {
    renderAnnouncementShow,
    renderAnnouncementForm,
    createAnnouncement,
    renderEditForm,
    updateAnnouncement,
    deleteAnnouncement
};