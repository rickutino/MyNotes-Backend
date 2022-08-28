import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../utils/AppError";

import auth from "../config/auth";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token be blank", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(
      token,
      auth.jwt.secretToken
    ) as IPayload;

    request.user = {
      id: Number(user_id)
    }

    next();
  } catch {
    throw new AppError("JWT token invalid", 401);
  }
}