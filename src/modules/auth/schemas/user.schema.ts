import { Schema } from 'mongoose';
export const UserSchema = new Schema<IUser>({ password: String, name: String });


export type IUser = {
    name: string
    password: string
}

export type UserWithTokens = {
	refreshToken: string;
	accessToken: string;
	user: IUser;
};