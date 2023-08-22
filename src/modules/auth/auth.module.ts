import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";

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

    PassportModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
