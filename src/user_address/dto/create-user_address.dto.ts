import { ApiProperty } from "@nestjs/swagger";

export class CreateUserAddressDto {

	@ApiProperty()
	city: string;

	@ApiProperty()
	district: string;

	@ApiProperty()
	street: string;

	@ApiProperty()
	country: string;

	@ApiProperty()
	telephone: string;
}
