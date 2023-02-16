import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { ServerError } from "../errors/generic.error";
import { RequestError } from "../errors/request.error";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/success.response";

export class UserController {
  public create(req: Request, res: Response) {
    try {
      const { username, email, password } =
        req.body;

      const database = new UserDatabase();
      const userEmail =
        database.getUserEmail(email);

      const newUser = new User(
        username,
        email,
        password
      );

      database.create(newUser);

      return SuccessResponse.created(
        res,
        "User successfully created",
        newUser.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const database = new UserDatabase();
      let user = database.getUserEmail(email);

      return SuccessResponse.ok(
        res,
        "Login successfully done",
        user?.id
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public list(req: Request, res: Response) {
    try {
      const database = new UserDatabase();
      let userList = database.list();

      return SuccessResponse.ok(
        res,
        "Users successfully listed",
        userList
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User id"
        );
      }

      const database = new UserDatabase();
      const userIndex =
        database.getUserIndex(userId);

      if (userIndex < 0) {
        return RequestError.notFound(res, "User");
      }

      const userDeleted =
        database.delete(userIndex);

      return SuccessResponse.ok(
        res,
        "User successfully deleted",
        userDeleted
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { username, email, password } =
        req.body;

      if (!userId) {
        return RequestError.notProvided(
          res,
          "User"
        );
      }

      const database = new UserDatabase();
      const user = database.getUserId(userId);

      if (!user) {
        return RequestError.notFound(res, "user");
      }

      if (username) {
        user.username = username;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        user.password = password;
      }

      return SuccessResponse.ok(
        res,
        "User successfully update",
        user
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
