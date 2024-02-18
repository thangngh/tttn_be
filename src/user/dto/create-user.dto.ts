import { ApiProperty } from "@nestjs/swagger"
import { IAddress } from "src/auth/interface/auth.interface"

export class CreateUserDto {
	@ApiProperty()
	firstName: string

	@ApiProperty()
	lastName: string

	@ApiProperty()
	email: string

	@ApiProperty()
	phone: string

	@ApiProperty()
	gender: string
}

export class addImageUserDto {
	@ApiProperty()
	avatar: string
}