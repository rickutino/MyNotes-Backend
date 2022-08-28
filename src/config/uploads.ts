import { resolve } from "path";
import multer from "multer";
import crypto from "crypto";

export const TPM_FOLDER = resolve(__dirname, "..", "..", "tmp");
export const UPLOADS_FOLDER = resolve(TPM_FOLDER, "uploads");

export const MULTER = {
  storage: multer.diskStorage({
    destination: TPM_FOLDER,
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
