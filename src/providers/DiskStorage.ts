import fs from "fs";
import { resolve } from "path";
import { TPM_FOLDER, UPLOADS_FOLDER } from "../config/uploads";

export class DiskStorage {
  async saveFile(file: string) {
    await fs.promises.rename(
      resolve(TPM_FOLDER, file),
      resolve(UPLOADS_FOLDER, file),
    );

    return file;
  }

  async deleteFile(file: string) {
    const filePath = resolve(UPLOADS_FOLDER, file);
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    };

    await fs.promises.unlink(filePath);
  }
}