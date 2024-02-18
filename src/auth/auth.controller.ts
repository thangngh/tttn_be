import { Body, Controller, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { FacebookDto } from './dto/facebook-auth.dto';
import { GoogleDto } from './dto/google-auth.dto';
import { UsersAuthDto } from './dto/users-auth.dto';
import { validatePassword, validateTokenPassword } from './dto/verify-password.dto';
import { IKey } from './interface/auth.interface';
import { SendMail } from './dto/send-mail.dto';
import { AuthUser } from 'src/user/user.decorator';
import { JWTAuthGuard } from './strategy/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
// import { JWTAuthGuard } from './strategy/jwt-auth.guard';
@Controller('auth')
export class AuthController {

	constructor(public AuthServices: AuthService) { }


	@Post("/register-user")
	async registerUser(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
		return this.AuthServices.register(authCredentialsDto);
	}

	@Post("/login-user")
	async loginUser(@Body(ValidationPipe) loginDto: UsersAuthDto) {
		return this.AuthServices.login(loginDto);
	}

	@Post("/login-google")
	async loginGoogle(@Body(ValidationPipe) googleDto: IKey) {
		return this.AuthServices.loginWithGoogle(googleDto);
	}

	@Post("/send-mail-reset-password")
	async sendMailResetPassword(@Body(ValidationPipe) sendMail: SendMail) {
		return this.AuthServices.sendEmailResetPassword(sendMail);
	}

	@Patch("/change-password-verify-token")
	async changePasswordWithToken(@Body() body: validateTokenPassword) {
		return this.AuthServices.changePasswordWithVerifyToken(body);
	}

	@UseGuards(JWTAuthGuard)
	@Patch("/change-password")
	async changePassword(@AuthUser() user: User, @Body() body: IKey) {
		return this.AuthServices.changePassword(user, body);
	}

}
