# 🏫 Department Connect

A comprehensive web application for managing department operations, designed to streamline communication between HODs, Faculty, and Students through announcements, document sharing, and leave management.

## 🌟 Features

### 📢 **Announcement Management**
- **Create & Manage**: Faculty and HOD can create, edit, and delete announcements
- **Priority Levels**: Low, Medium, High priority announcements
- **Target Audience**: Announcements can be targeted to Students, Faculty, or All
- **Real-time Updates**: Students receive instant notifications

### 📁 **Document Repository**
- **Secure Upload**: Faculty can upload documents (PDF, DOC, DOCX, images)
- **Category Organization**: Documents organized by Syllabus, Notes, Assignments, Notices, Forms
- **Access Control**: Public documents for students, private for faculty only
- **Local Storage**: All files stored locally (no external dependencies)

### 🗓️ **Leave Management System**
- **Student Requests**: Students can submit leave requests with attachments
- **Faculty Review**: Class teachers can approve/reject requests
- **HOD Oversight**: Complete administrative control over all requests
- **Status Tracking**: Real-time status updates (Pending, Approved, Rejected)

### 👥 **Role-Based Access Control**
- **Students**: View announcements, access documents, submit leave requests
- **Faculty**: All student features + create announcements, upload documents, review assigned leave requests
- **HOD**: Complete administrative access to all features

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Frontend**: EJS templating, Bootstrap 5
- **File Upload**: Multer with local storage
- **Validation**: Joi schema validation
- **Session Management**: Express-session with connect-flash

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/department-connect.git
cd department-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
**Windows:**
```bash
# Use the provided batch file
start-mongodb.bat

# Or manually start MongoDB
mongod --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Run the Application
```bash
node app.js
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
department-connect/
├── 📂 config/
│   └── localStorage.js          # Local file storage configuration
├── 📂 controller/
│   ├── announcementController.js # Announcement CRUD operations
│   ├── documentController.js     # Document management
│   ├── leaveRequestController.js # Leave request handling
│   └── user.js                  # User authentication
├── 📂 middleware/
│   ├── authMiddleware.js        # Authentication middleware
│   ├── roleMiddleware.js        # Role-based authorization
│   └── announcementMiddleware.js # Validation middleware
├── 📂 models/
│   ├── user.js                  # User schema (HOD, Faculty, Student)
│   ├── announcementModel.js     # Announcement schema
│   ├── documentModel.js         # Document schema
│   └── leaveRequestModel.js     # Leave request schema
├── 📂 routes/
│   ├── authRoutes.js           # Authentication routes
│   ├── announcementRoutes.js   # Announcement routes
│   ├── documentRoutes.js       # Document routes
│   └── leaveRequestRoutes.js   # Leave request routes
├── 📂 views/
│   ├── 📂 auth/                # Login/Signup pages
│   ├── 📂 common/              # Shared components
│   ├── 📂 faculty/             # Faculty dashboard
│   ├── 📂 hod/                 # HOD dashboard
│   ├── 📂 user/                # Student dashboard
│   └── 📂 includes/            # Reusable components
├── 📂 public/
│   └── 📂 uploads/             # Local file storage
├── 📂 utils/
│   ├── schema.js               # Joi validation schemas
│   └── ExpressError.js         # Custom error handling
├── app.js                      # Main application file
└── package.json               # Dependencies and scripts
```

## 👤 User Roles & Permissions

### 🎓 **Student (role: 'user')**
- View announcements targeted to students
- Access public documents and resources
- Submit leave requests with attachments
- Track leave request status

### 👨‍🏫 **Faculty (role: 'faculty')**
- All student permissions
- Create, edit, delete own announcements
- Upload and manage documents
- Review leave requests from assigned students
- Approve/reject leave applications

### 👨‍💼 **HOD (role: 'hod')**
- All faculty permissions
- Manage ALL announcements (full CRUD)
- Administrative access to all documents
- Oversee ALL leave requests
- Complete department oversight

## 🔐 Authentication Flow

1. **Registration**: Users sign up with username, email, password, and role
2. **Login**: Secure authentication using Passport.js
3. **Session Management**: Persistent sessions with automatic logout
4. **Role-based Redirects**: Users redirected to appropriate dashboards

## 📊 Database Schema

### User Model
```javascript
{
  username: String,        // Unique username
  email: String,          // Unique email
  password: String,       // Hashed password (handled by passport-local-mongoose)
  role: String,           // 'hod', 'faculty', 'user'
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Announcement Model
```javascript
{
  title: String,          // Announcement title
  body: String,           // Announcement content
  createdBy: ObjectId,    // Reference to User
  targetRole: String,     // 'user', 'faculty', 'all'
  priority: String,       // 'low', 'medium', 'high'
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Document Model
```javascript
{
  title: String,          // Document title
  description: String,    // Optional description
  fileName: String,       // Original filename
  filePath: String,       // Local storage path
  fileType: String,       // MIME type
  fileSize: Number,       // File size in bytes
  uploadedBy: ObjectId,   // Reference to User
  category: String,       // 'syllabus', 'notes', 'assignments', etc.
  isPublic: Boolean,      // Public/Private access
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Leave Request Model
```javascript
{
  title: String,          // Leave subject
  reason: String,         // 'sick', 'personal', 'academic'
  fromDate: Date,         // Leave start date
  toDate: Date,           // Leave end date
  classTeacher: String,   // Faculty username
  attachmentPath: String, // Optional file attachment
  requestedBy: ObjectId,  // Reference to User
  status: String,         // 'pending', 'approved', 'rejected'
  reviewedBy: ObjectId,   // Reference to reviewing faculty
  reviewDate: Date,       // Review timestamp
  reviewComments: String, // Optional review comments
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB at `mongodb://127.0.0.1:27017/deptConnect` with:
- **Connection timeout**: 5 seconds
- **Socket timeout**: 45 seconds
- **Graceful error handling**: App continues running if DB is unavailable

### File Storage
- **Upload directory**: `public/uploads/`
- **Supported formats**: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
- **File size limit**: 10MB
- **Unique filenames**: Timestamp-based naming to prevent conflicts

## 🚨 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB manually
mongod --dbpath "C:\data\db"

# Or use the provided batch file (Windows)
start-mongodb.bat
```

### Port Already in Use
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change port in app.js
const PORT = 3000; // Change from 5000
```

### File Upload Issues
- Ensure `public/uploads/` directory exists
- Check file permissions
- Verify file size is under 10MB
- Confirm file type is supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
