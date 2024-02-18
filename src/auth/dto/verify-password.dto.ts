import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsJWT } from "class-validator";

export class validatePassword {


	@ApiProperty()
	@IsNotEmpty()
	password: string
}

export class validateTokenPassword extends validatePassword {
	@ApiProperty()
	@IsNotEmpty()
	@IsJWT({ message: "Wrong format token" })
	token: string
}