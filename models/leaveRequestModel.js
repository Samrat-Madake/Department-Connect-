const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    reason: {
        type: String,
        required: true,
        enum: ['sick', 'personal', 'academic'],
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    classTeacher: {
        type: String,
        required: true,
        trim: true
    },
    attachmentPath: {
        type: String,
        default: null // Optional file attachment
    },
    attachmentName: {
        type: String,
        default: null
    },
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewDate: {
        type: Date,
        default: null
    },
    reviewComments: {
        type: String,
        maxlength: 500,
        default: null
    }
}, {
    timestamps: true
});

// Calculate number of days
leaveRequestSchema.virtual('numberOfDays').get(function () {
    const timeDiff = this.toDate.getTime() - this.fromDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);