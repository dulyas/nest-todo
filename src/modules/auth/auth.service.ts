import { Injectable } from '@nestjs/common';
import { IUser } from './schemas/user.schema';

@Injectable()
export class AuthService {


    async register(
	name: string,
	password: string,
): Promise<IUser> {
    const candidate = await User.query().findOne({ name });

	if (candidate) {
		throw ApiError.BadRequest("Name already exist");
	}
	const hashPassword = await bcrypt.hash(password, 3);

	const user = await User.query().insertAndFetch({
		name,
		password: hashPassword,
	});

	const {
		accessToken,
		refreshToken,
		user: userDto,
	} = await generateAndSaveTokens(user);

	return {
		accessToken,
		refreshToken,
		user: userDto,
	};
}
}
