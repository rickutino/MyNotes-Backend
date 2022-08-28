import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { sqliteConnection } from "../database/sqlite";
import { IUserDTO } from "../utils/dtos/IUserDTO";

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("This email already exists")
    }

    const passwordHash = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    return response.status(201).json()
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get(
      "SELECT * FROM users WHERE id = (?)",
      [user_id]
    ) as IUserDTO;

    if (!user) {
      throw new AppError("User not found!")
    };

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("This email already used!")
    };    

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldPassword) {
      throw new AppError("You need to enter the old password to set the new password")
    };

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);
      
      if (!checkOldPassword) {
        throw new AppError("Old password does not match is incorrect")
      };

      user.password = await hash(password, 8)
    };


    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
     );

    return response.json()
  }
}

export { UsersController };
