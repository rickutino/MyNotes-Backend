import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { connection as knex} from "../database/knex";

class NotesController {
  async index(request: Request, response: Response): Promise<Response> {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    if (tags && title) {
      const filterTags = (tags as string).split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.description",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title")
    } else if (tags) {
      const filterTags = (tags as string).split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.description",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title")
    } else if (title) {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .orderBy("title");
    }
    
    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map (note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });

    return response.status(200).json(notesWithTags);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { title, description, tags, links } = request.body;
    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });

    const linksInsert = links.map((link: string) => {
      return {
        note_id,
        url: link
      }
    });

    await knex("links").insert(linksInsert);

    const newTags = tags.map(async (name: string) => {
      const existingTag = await knex('tags').where({ name }).first();
      if (existingTag) {
        return null
      }

      return {
        note_id,
        user_id,
        name
      }
    });
    
    const tagsInsert = newTags.filter((tag: string) => tag !== null);

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    if (!note) {
      throw new AppError("This id not found")
    };

    return response.json([{
      ...note,
      tags,
      links
    }]);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const deleteNote = await knex("notes").where({ id }).delete();

    if (!deleteNote) {
      throw new AppError("This id not found")
    };

    response.status(204).json()
  }
}

export { NotesController };
