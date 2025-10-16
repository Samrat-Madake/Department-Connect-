const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: {
        type: String,
        required: true,
        enum: ['user', 'faculty', 'all'],
    },
    priority:{
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }
}, { timestamps: true });


module.exports = mongoose.model('Announcement', announcementSchema);