import { TokenService } from "./token.service";
import {
  ITokens,
  IUser,
  IUserRequest,
  IUserDtoWithRefreshToken,
  IUserDtoWithTokens,
} from "./schemas/user.schema";
import { compare, hash } from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<IUser>,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  async register({
    name,
    password,
  }: IUserRequest): Promise<IUserDtoWithTokens> {
    const user = await this.userModel.findOne({ name }).lean();

    console.log(user);

    const PASSWORD_SALT = +this.configService.get("PASSWORD_SALT");

    if (user) {
      throw new HttpException("Name already exist", 400);
    }

    const accessToken = this.tokenService.generateJWTToken({ name });
    const refreshToken = await this.tokenService.generateJWTRefresh();
    const hashPassword = await hash(password, PASSWORD_SALT);

    await this.userModel.collection.insertOne({
      name,
      password: hashPassword,
      refreshToken,
    });

    return {
      name,
      refreshToken,
      accessToken,
    };
  }

  async refresh({ refreshToken }: IUserDtoWithRefreshToken): Promise<ITokens> {
    const user = await this.userModel.findOne({ refreshToken }).lean();

    if (user) {
      return await this.login(user);
    } else {
      throw new UnauthorizedException("Bad token");
    }
  }

  async login({ name, password }: IUserRequest): Promise<ITokens> {
    const user = await this.userModel.findOne({ name }).lean();
    if (!user) {
      throw new UnauthorizedException("No user for this login");
    }

    const isPassEquals = await compare(password, user.password);
    if (!isPassEquals) {
      throw new UnauthorizedException("Wrong password");
    }

    const accessToken = this.tokenService.generateJWTToken({ name });
    const refreshToken = await this.tokenService.generateJWTRefresh();

    await this.tokenService.updateRefresh(name, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.tokenService.removeRefresh(refreshToken);
    return {
      message: "Logged out successfully",
    };
  }
}
