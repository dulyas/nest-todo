import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("TOKEN_SECRET"),
        signOptions: { expiresIn: configService.get<string>("TOKEN_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
