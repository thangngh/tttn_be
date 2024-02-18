import { ApiProperty } from "@nestjs/swagger";

export class CreateCartDto {

	@ApiProperty()
	productId: string;

	@ApiProperty()
	productInventoryId: string;

	@ApiProperty()
	userId: string

	@ApiProperty()
	total: number

	@ApiProperty()
	price: string
}
