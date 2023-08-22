import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { PassportModule } from "@nestjs/passport";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./auth.controller";
const { TOKEN_SECRET, TOKEN_EXPIRES } = process.env;

@Module({
  imports: [
    JwtModule.register({
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRES },
    }),
    PassportModule,
    HttpModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
