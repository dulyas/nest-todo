import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import crypto from "crypto";
import { IUser } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  generateJWTToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
  generateJWTRefresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        crypto.randomBytes(48, (err, buffer: Buffer) => {
          resolve(buffer.toString("hex"));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async updateRefresh(name: string, refreshToken: string): Promise<IUser> {
    return this.userModel
      .findOneAndUpdate({ name }, { $set: { refreshToken } })
      .select({ refreshToken: 1, _id: 0 });
  }

  async removeRefresh(refreshToken: string): Promise<IUser> {
    return this.userModel.findOneAndUpdate(
      { refreshToken },
      { $set: { refreshToken: null } },
      { returnDocument: "after" },
    );
  }
}
