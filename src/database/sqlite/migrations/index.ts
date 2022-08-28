import { sqliteConnection } from "../../sqlite";
import { createUsers } from "./createUsers";

async function migrationsRun() {
  const schemas = [
    createUsers
  ].join('');
  
  sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error));
}

export { migrationsRun };
