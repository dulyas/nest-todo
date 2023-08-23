import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";

import { TodoSchema } from "./schemas/todo.schema";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Todo", schema: TodoSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("TOKEN_SECRET"),
        signOptions: { expiresIn: configService.get<string>("TOKEN_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
