import {
  NextFunction,
  Request,
  Response,
} from "express";
import { UserDatabase } from "../database/user.database";
import { ServerError } from "../errors/generic.error";
import { RequestError } from "../errors/request.error";

export class NoteValidatorMiddleware {
  public static userExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User"
        );
      }

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static userAndNoteExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, noteId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "user"
        );
      }

      if (!noteId) {
        return RequestError.notProvided(
          res,
          "Note"
        );
      }

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const note = user?.notes.find(
        (note) => note.id === noteId
      );

      if (!note) {
        return RequestError.notFound(res, "Note");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public static mandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description } = req.body;

      if (!title) {
        return RequestError.notProvided(
          res,
          "Title"
        );
      }

      if (!description) {
        return RequestError.notProvided(
          res,
          "Description"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
