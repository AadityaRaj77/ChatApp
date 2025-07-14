const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ✅ folder jahan file jaayegi
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|pdf|mp4/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        if (allowed.test(ext) && allowed.test(mime)) {
            cb(null, true);
        } else {
            cb(new Error('Only images, videos, PDFs allowed'));
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
