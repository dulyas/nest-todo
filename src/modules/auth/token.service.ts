import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto'

const { TOKEN_SECRET } = process.env

@Injectable()
export class TokenService extends PassportStrategy(Strategy) {

  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: TOKEN_SECRET,
    });
  }

    generateJWTToken(payload: any): any {
    return this.jwtService.sign(payload);
  }
     generateJWTRefresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        crypto.randomBytes(48, (err, buffer: Buffer) => {
          resolve(buffer.toString('hex'));
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
