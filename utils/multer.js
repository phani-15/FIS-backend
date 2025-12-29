import multer from "multer";

export const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/profiles",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
export const uploadCred = multer({
  storage: multer.diskStorage({
    destination: "uploads/cred",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
