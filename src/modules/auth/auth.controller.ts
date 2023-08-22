import { Controller, Get, Post, Body, Res, Req } from "@nestjs/common";
import {
  ITokens,
  IUserDtoWithTokens,
  IUserBody,
  IUserRequest,
} from "./schemas/user.schema";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/register")
  async register(
    @Body() { name, password }: IUserRequest,
  ): Promise<IUserDtoWithTokens> {
    try {
      return await this.authService.register({ name, password });
    } catch (error) {
      return error.message;
    }
  }

  @Post("/login")
  async login(
    @Body() { name, password, keepLogin }: IUserBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ITokens> {
    try {
      const userData = await this.authService.login({ name, password });
      if (keepLogin) {
        response.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      }

      return userData;
    } catch (error) {
      return error.message;
    }
  }

  @Post("/logout")
  async logout(
    @Req() { cookies }: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { refreshToken } = cookies;
      const token = await this.authService.logout(refreshToken);
      response.clearCookie("refreshToken");
      return token;
    } catch (error) {
      return error.message;
    }
  }

  @Get("/refresh")
  async refresh(
    @Req() { cookies }: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken = cookies;
      const userData = await this.authService.refresh(refreshToken);
      response.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return userData;
    } catch (error) {
      return error.message;
    }
  }
}
