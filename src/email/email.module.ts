import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useClass: EmailService
		})
	],
	providers: [EmailService],
	exports: [EmailService]
})
export class EmailModule { }
