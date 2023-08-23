import { Injectable } from "@nestjs/common";
import { ITodo } from "./schemas/todo.schema";
import { IQueryObjectItem, IOrderByCfg, IPage } from "./helpers/types";
import orderByGenerator from "./helpers/orderByGenerator";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TodoService {
  constructor(@InjectModel("Todo") private readonly todoModel: Model<ITodo>) {}

  async getTodos(
    status: string,
    username: string,
    email: string,
    page: number,
  ): Promise<IPage<ITodo>> {
    const orderByCfg: IOrderByCfg = orderByGenerator({
      username: username as IQueryObjectItem,
      done: status as IQueryObjectItem,
      email: email as IQueryObjectItem,
    });

    const pageInfo = await this.todoModel
      .find()
      .skip(3 * page)
      .limit(3)
      .sort(orderByCfg);

    const total = await this.todoModel.count();
    return {
      total,
      results: pageInfo,
    };
  }

  async createTodo(
    username: string,
    email: string,
    title: string,
  ): Promise<ITodo> {
    const newTodo = await this.todoModel.insertMany([
      {
        title,
        email,
        username,
      },
    ]);

    return newTodo[0];
  }

  async deleteTodo(id: string): Promise<number> {
    await this.todoModel.deleteOne({ _id: id });
    return 1;
  }

  async updateTodoTitle(id: string, title: string): Promise<ITodo> {
    const updatedTodo = await this.todoModel.findById(id);
    updatedTodo.title = title;
    updatedTodo.edited = true;
    updatedTodo.save();
    return updatedTodo;
  }

  async updateTodoDone(id: string, done: number | boolean): Promise<ITodo> {
    const updatedTodo = await this.todoModel.findById(id);
    updatedTodo.done = !!done;
    updatedTodo.edited = true;
    updatedTodo.save();
    return updatedTodo;
  }
}
