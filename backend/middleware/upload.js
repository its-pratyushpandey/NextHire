// Import multer
import multer from 'multer';

// Memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume') {
        // Resume: PDF/DOC/DOCX
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/msword' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed for resume.'), false);
        }
    } else if (file.fieldname === 'photo') {
        // Photo: image only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only image files are allowed for photo.'), false);
        }
    } else {
        cb(new Error('Invalid field name'), false);
    }
};

// Limits
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 2 // Max 2 files
};

// Export upload middleware
export const upload = multer({
    storage,
    fileFilter,
    limits
});