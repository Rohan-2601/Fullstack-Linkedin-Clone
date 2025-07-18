import multer from "multer";

// ✅ First define storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// ✅ Then pass it to multer
const upload = multer({ storage });

export default upload;
