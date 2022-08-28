import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";

import { migrationsRun } from "./database/sqlite/migrations";
import { router } from "./routes";
import { AppError } from "./utils/AppError";
import { UPLOADS_FOLDER } from "./config/uploads";

const app = express();

app.use(express.json());

app.use("/files", express.static(UPLOADS_FOLDER));

app.use(router);

migrationsRun();

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };


