import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Kiểm tra loại file để lưu vào thư mục tương ứng
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images');
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'uploads/videos');
        } else {
            cb(new Error('File không hợp lệ'), "");
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Đặt tên file có thêm timestamp để tránh trùng lặp
    }
});

export const upload = multer({ storage: storage });