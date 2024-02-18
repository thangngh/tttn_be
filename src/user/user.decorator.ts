import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from './entities/user.entity';

export interface IGetUserAuthInfoRequest extends Request {
	user: string;
}

export const AuthUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest<IGetUserAuthInfoRequest>().user as unknown as User;
		return data ? user && user[data] : user;
	},
);
