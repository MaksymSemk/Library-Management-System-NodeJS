import fs from 'fs';
import path from 'path';
import multer from 'multer';

const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const extension = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${extension}`);
  }
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG and PNG files are allowed'));
  }

  cb(null, true);
};

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
