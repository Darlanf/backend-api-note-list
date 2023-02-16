import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { ServerError } from "../errors/generic.error";
import { RequestError } from "../errors/request.error";
import { Note } from "../models/note.model";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/success.response";

export class NoteController {
  public listAll(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, filed } = req.query;
      const isFiled =
        filed?.toString().toLowerCase() ===
        "true";

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      // lista original das notas
      let noteList = user?.notes;

      if (title) {
        noteList = noteList?.filter(
          (note) =>
            note.title
              .toString()
              .toLowerCase() ===
            title?.toString().toLowerCase()
        );
      }

      // Paulo sugeriu para ficar dinamico
      // if (filed === undefined) {
      //   filed = Boolean(false);
      // }
      // noteList = noteList.filter(
      //   (note) => note.filed === Boolean(filed)
      // );

      if (isFiled !== undefined) {
        noteList = noteList?.filter(
          (note) => note.filed === isFiled
        );
      }

      // funcionou
      // if (filed !== undefined) {
      //   noteList = noteList.filter(
      //     (note) => note.filed === true
      //   );
      // } else {
      //   noteList = noteList.filter(
      //     (note) => note.filed === false
      //   );
      // }

      return SuccessResponse.ok(
        res,
        "Notes successfully listed",
        noteList
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public listOne(req: Request, res: Response) {
    try {
      const { userId, noteId } = req.params;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      const note = user?.notes.find(
        (note) => note.id === noteId
      );

      return SuccessResponse.ok(
        res,
        "Note successfully listed",
        note
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, description } = req.body;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      const note = new Note(title, description);

      user?.addNote(note);

      return SuccessResponse.created(
        res,
        "Note successfully created",
        note
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId, noteId } = req.params;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      const noteList = user!.notes;

      const noteIndex = noteList.findIndex(
        (note) => note.id === noteId
      );

      if (noteIndex < 0) {
        return RequestError.notFound(res, "Note");
      }

      const noteDeleted = noteList.splice(
        noteIndex!,
        1
      );

      return SuccessResponse.ok(
        res,
        "Note successfully deleted",
        noteDeleted
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId, noteId } = req.params;
      const { title, description, filed } =
        req.body;

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      const noteList = user?.notes;
      const note = noteList?.find(
        (note) => note.id === noteId
      );

      if (title) {
        note!.title = title;
      }

      if (description) {
        note!.description = description;
      }

      if (filed !== undefined) {
        note!.filed = filed;
      }

      return SuccessResponse.ok(
        res,
        "Note successfully updated",
        { note, noteList }
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
