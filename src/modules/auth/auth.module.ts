import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
    imports: [
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: jwtConstants.expiresIn },
    // }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  providers: [AuthService],
})
export class AuthModule {}
