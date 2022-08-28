
import { IUserDTO } from "../../utils/dtos/IUserDTO";

declare global {
  namespace Express {
    interface Request {
      user: Pick<IUserDTO, "id">
    }
  }
}