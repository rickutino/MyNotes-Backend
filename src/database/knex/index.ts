import knex from "knex";
// @ts-ignore
import { development } from "../../../knexfile";

export const connection = knex(development);