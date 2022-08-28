import { Request, Response } from "express";
import { connection as knex } from "../database/knex";

class TagsController {
  async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const tags = await knex("tags").where({ user_id });
    
    return response.json(tags);
  }
}

export { TagsController };
