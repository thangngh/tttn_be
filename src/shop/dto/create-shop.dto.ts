import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { IAddress } from "src/auth/interface/auth.interface";

export class CreateShopDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	description: string

	@ApiProperty()
	@IsNotEmpty()
	phone: string

	@ApiProperty()
	@IsOptional()
	address: IAddress
}
