import { Request, Response } from "express";
import { AppError } from "../utils/AppError";

import { compare } from "bcryptjs";
import { connection as knex } from "../database/knex";

import { IUserDTO } from "src/utils/dtos/IUserDTO";

import auth from "../config/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const { secretToken, expiresIn } = auth.jwt;


    const user: IUserDTO = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email or password incorrect!", 401)
    };

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Email or password incorrect!", 401)
    };

    const token = sign({}, secretToken, {
      subject: String(user.id),
      expiresIn
    })
    return response.json({ user, token })
  }
}

export { SessionsController };
