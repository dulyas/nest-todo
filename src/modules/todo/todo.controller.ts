import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { ICreateTodoBody, ITodo } from "./schemas/todo.schema";
import { AuthGuard } from "../auth/auth.guard";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Delete("/:id")
  async deleteTodo(@Param("id") id: string): Promise<{ deleted: number }> {
    if (!id) throw new HttpException("Insert todo id for delete", 400);

    const deleted = await this.todoService.deleteTodo(id);

    return { deleted };
  }

  @UseGuards(AuthGuard)
  @Put("/:id/title")
  async updateTodoTitle(
    @Param("id") id: string,
    @Query("title") title: string,
  ): Promise<{ todo: ITodo }> {
    const todo = await this.todoService.updateTodoTitle(id, title);

    return { todo };
  }

  @UseGuards(AuthGuard)
  @Put("/:id/done")
  async updateTodoDone(
    @Param("id") id: string,
    @Query("done") done: boolean,
  ): Promise<{ todo: ITodo }> {
    const todo = await this.todoService.updateTodoDone(id, done);

    return { todo };
  }

  @UseGuards(AuthGuard)
  @Get("/")
  async getTodos(
    @Query("status") status: string,
    @Query("username") username: string,
    @Query("email") email: string,
    @Query("page") page: number = 0,
  ): Promise<{ pageInfo: any }> {
    const pageInfo = await this.todoService.getTodos(
      status,
      username,
      email,
      +page,
    );

    return { pageInfo };
  }

  @Post("/")
  async createTodo(
    @Body() { title, username, email }: ICreateTodoBody,
  ): Promise<{ todo: ITodo }> {
    if (!email) throw new HttpException("Email can't be empty", 400);
    if (!title) throw new HttpException("Title can't be empty", 400);
    if (!username) throw new HttpException("Username can't be empty", 400);
    if (!String(email).match(/.+@.+\..+/i))
      throw new HttpException("Not Valid Email", 400);

    const todo = await this.todoService.createTodo(username, email, title);

    return { todo };
  }
}
