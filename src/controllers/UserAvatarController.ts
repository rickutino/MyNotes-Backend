import { Request, Response } from "express";
import { DiskStorage } from "../providers/DiskStorage";

import { AppError } from "../utils/AppError";
import { connection as knex } from "../database/knex";

class UserAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const avatarFilename = request.file?.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users")
      .where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Only authenticated user can change avatar", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    if (!avatarFilename) {
      throw new AppError("Image does not exist")
    }

    const filename = await diskStorage.saveFile(avatarFilename);

    user.avatar = filename;

    await knex("users").update(user).where({ id: user_id });

    return response.json(user);
  }
}

export { UserAvatarController }