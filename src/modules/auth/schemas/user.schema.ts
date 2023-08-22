import { Schema } from "mongoose";
export const UserSchema = new Schema<IUser>({
  password: String,
  name: String,
  refreshToken: String,
});

export type IUser = {
  name: string;
  password: string;
  refreshToken: string;
};

export type IUserRequest = {
  name: string;
  password: string;
};

export type IUserDtoWithRefreshToken = {
  refreshToken: string;
  name: string;
};

export type ITokens = {
  refreshToken: string;
  accessToken: string;
};

export type IUserDtoWithTokens = {
  accessToken: string;
} & IUserDtoWithRefreshToken;

export type IUserBody = {
  keepLogin: boolean;
} & IUser;
