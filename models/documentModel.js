const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    description: { 
        type: String, 
        maxlength: 500,
        trim: true
    },
    fileName: { 
        type: String, 
        required: true 
    },
    filePath: { 
        type: String, 
        required: true 
    },
    fileType: { 
        type: String, 
        required: true 
    },
    fileSize: { 
        type: Number, 
        required: true 
    },
    uploadedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    category: {
        type: String,
        enum: ['syllabus', 'notes', 'assignments', 'notices', 'forms', 'other'],
        default: 'other'
    },
    isPublic: {
        type: Boolean,
        default: true // Students can view public documents
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Document', documentSchema);