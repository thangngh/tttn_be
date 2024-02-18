import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Equal, Not, Repository } from 'typeorm';
import { enumRole, IKey, ILogin, IRegister, ProviderType } from './interface/auth.interface';
import { JwtPayload } from './interface/jwt-payload.interface';
import { GoogleDto } from './dto/google-auth.dto';
import jwt_decode from 'jwt-decode';
import { SendMail } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { validateTokenPassword } from './dto/verify-password.dto';
@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name)
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailerService,
	) { }


	async login(body: ILogin) {
		const { username, password } = body;

		const findUser = await this.userRepository.findOne({
			where: {
				username,
			}
		})

		const isMatch = await findUser?.validatePassword(password as string);

		if (!isMatch || !findUser) {
			throw new HttpException('Wrong username or password', HttpStatus.BAD_REQUEST);
		}

		const checkActiveUser = await this.validateActiveUser(findUser.id.toString())

		if (!checkActiveUser) {
			throw new HttpException("Your account already lock", HttpStatus.BAD_REQUEST)
		}

		const payload = { id: findUser.id, username: findUser.username };

		return {
			statusCode: HttpStatus.OK,
			message: 'Login successfully',
			accessToken: this.jwtService.sign(payload),
		};

	}

	async validateActiveUser(userId: String) {
		const user = await this.userRepository.findOne({
			where: {
				id: +userId,
				isActive: true
			}
		})

		return !!user
	}

	async register(body: IRegister) {
		const { firstName, lastName, email, username, password, providerType = ProviderType.USERNAME } = body;

		const validateEmail = await this.validateEmail({ email })

		if (validateEmail) {
			throw new HttpException(`Email ${email} already exists`, HttpStatus.BAD_REQUEST);
		}

		const validateUsername = await this.validateUsername({ username })

		if (validateUsername) {
			throw new HttpException(`Username ${username} already exists`, HttpStatus.BAD_REQUEST);
		}

		const newUser = new User({
			firstName, lastName, email, username, password, providerType, roleId: enumRole.USER, isActive: true
		})

		const user = await this.userRepository.save(newUser);

		return {
			status: HttpStatus.OK,
			message: 'Register successfully',
			data: user
		}

	}

	async validateEmail(body: IKey) {
		const { email } = body;
		const findUser = await this.userRepository.findOne({
			where: { email }
		})
		return !!findUser;
	}

	async validateUsername(body: IKey) {
		const { username } = body;
		const findUser = await this.userRepository.findOne({
			where: { username }
		})
		return !!findUser
	}

	async validatePhone(body: IKey) {
		const { phone, id } = body;
		const findUser = await this.userRepository.findOne({
			where: {
				phone,
				id: Not(Equal(+id))
			}
		})

		return !!findUser
	}

	async loginWithGoogle(body: IKey) {
		const { accessToken } = body;
		if (accessToken) {
			const decoded: any = jwt_decode(accessToken)
			const { email, name, picture } = decoded;
			try {

				const findUser = await this.userRepository.findOne({
					where: { email }
				})
				if (findUser != null) {
					const payload = { id: findUser.id, username: findUser.username };
					return {
						statusCode: HttpStatus.OK,
						message: 'Login successfully',
						accessToken: this.jwtService.sign(payload),
					};
				} else {
					const newUser = new User({
						firstName: decoded?.family_name, lastName: decoded?.given_name, email, username: email, password: "unknown", providerType: ProviderType.GOOGLE, roleId: enumRole.USER, isActive: true
					})
					const user = await this.userRepository.save(newUser);
					const payload = { id: user.id, username: user.username };
					return {
						statusCode: HttpStatus.OK,
						message: 'Login successfully',
						accessToken: this.jwtService.sign(payload),
					};
				}
			} catch (error) {
				throw new HttpException('Login with google fail', HttpStatus.BAD_REQUEST);
			}
		}
	}

	async sendEmailResetPassword(body: SendMail) {
		const { email } = body;

		const findUser = await this.userRepository.findOne({
			where: { email: email.trim() }
		})

		// if (!findUser) {
		// 	this.logger.error(`User have email: ${email} not found`)
		// 	return;
		// }


		const generateToken = await this.jwtService.sign(
			{ email },
			{ expiresIn: '15m' }
		)

		const URL = `change-password?token=${generateToken}`;

		findUser && this.mailService.sendMail({
			from: this.configService.get('MAIL_USER'),
			to: email,
			subject: 'reset password',
			template: 'reset-password',
			context: {
				email: email,
				resetLink: this.configService.get('FE_HOST') + URL,
				contact: this.configService.get('MAIL_USER'),
			},
		});

		return {
			status: HttpStatus.OK,
		};

	}

	async changePasswordWithVerifyToken(body: validateTokenPassword) {
		const { token, password } = body;

		try {
			const decoded: any = await jwt_decode(token);
			const user = await this.userRepository.findOne({
				where: {
					email: decoded?.email,
				},
			});

			if (!user) {
				throw new HttpException('Some thing went wrong!, User not exist', HttpStatus.BAD_REQUEST);
			}

			user.password = password;
			const update = await this.userRepository.save(user);

			if (!update)
				throw new HttpException(
					'Some thing went wrong!',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);

			return {
				message: 'Update password success!',
				statusCode: HttpStatus.OK,
			};
		} catch (error) {
			// handle the error
			if (error.name === 'TokenExpiredError') {
				// token has expired
				throw new HttpException('Token has expired', HttpStatus.BAD_REQUEST);
			}
		}


	}

	async changePassword(user: User, body: IKey) {
		const { oldPassword, newPassword } = body;
		const { id } = user;

		const userRepository = await this.userRepository.findOne({
			where: { id },
		});

		if (!userRepository) {
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
		}

		const isMatch = await user?.validatePassword(oldPassword as string);

		if (!isMatch) {
			throw new HttpException('CurrentPassword is incorrect', HttpStatus.BAD_REQUEST);
		}

		const salt = await bcrypt.genSalt();
		const newPass = await bcrypt.hash(newPassword, salt);

		await this.userRepository
			.createQueryBuilder('user')
			.update(User)
			.set({
				password: newPass,
			})
			.where('id = :id', { id: id })
			.execute();
		return {
			status: HttpStatus.OK,
			message: `Change Password successfully`,
		};
	}

	async verifyPayload(payload: JwtPayload) {
		const { id } = payload
		try {
			const query = await this.userRepository
				.createQueryBuilder("user")
				.where("user.id = :id", { id })
				.getOne();

			return query;
		} catch (error) {
			throw new UnauthorizedException(`
				Unauthorized access with payload: ${JSON.stringify(payload.username)}
			`)
		}
	}
}
