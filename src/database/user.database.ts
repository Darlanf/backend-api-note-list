import { User } from "../models/user.model";
import { users } from "./users";

export class UserDatabase {
  public list() {
    return [...users];
  }

  public getUserEmail(email: string) {
    return users.find(
      (user) => user.email === email
    );
  }

  public getUserId(id: string) {
    return users.find((user) => user.id === id);
  }

  public getUserIndex(id: string) {
    return users.findIndex(
      (user) => user.id === id
    );
  }

  public create(user: User) {
    users.push(user);
  }

  public delete(index: number) {
    users.splice(index, 1);
  }
}
