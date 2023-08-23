import { Schema } from "mongoose";
export const TodoSchema = new Schema<ITodo>({
  title: String,
  edited: Boolean,
  done: Boolean,
  username: String,
  email: String,
});

export type ITodo = {
  title: string;
  edited: boolean;
  done: boolean;
  username: string;
  email: string;
};

export type ICreateTodoBody = {
  title: string;
  username: string;
  email: string;
};
