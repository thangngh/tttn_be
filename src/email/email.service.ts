import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";
@Injectable()
export class EmailService implements MailerOptionsFactory {
	constructor(private configService: ConfigService) { }

	createMailerOptions(): MailerOptions {
		return {
			transport: {
				host: this.configService.get('MAIL_HOST'),
				secure: true,
				port: 587,
				// service: 'gmail',
				auth: {
					// type: 'OAuth2',
					user: this.configService.get('MAIL_USER'),
					pass: this.configService.get('MAIL_PASSWORD'),
					// clientId: '472277128248-lb1rrdmorn89f6bbqaham1i2jpuq5jmq.apps.googleusercontent.com',
					// clientSecret: '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',
					// refreshToken: '1//04hig-KMpr-ZeCgYIARAAGAQSNwF-L9Ir6bmzYpzYFFGoaDMFHacBKrfhqTV2gTgtfoGf9wstFnce5k7IiwOWssMO9YIuUZYNvl8'
				},
				requireTLS: true,
				ignoreTLS: true,
				debug: true,
				tls: {
					rejectUnauthorized: false
				}
			},
			defaults: {
				from: `"test" <${this.configService.get('MAIL_USER')}>`,
			},
			template: {
				dir: join(__dirname, './templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}
	}
}