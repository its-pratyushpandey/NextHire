import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume') {
        // Accept PDF, DOC, DOCX files for resume
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/msword' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed for resume.'), false);
        }
    } else if (file.fieldname === 'photo') {
        // Accept image files for photo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only image files are allowed for photo.'), false);
        }
    } else {
        cb(new Error('Invalid field name'), false);
    }
};

const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Maximum 2 files (resume and photo)
};

export const upload = multer({
    storage,
    fileFilter,
    limits
}); 