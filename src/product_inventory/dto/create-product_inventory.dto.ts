import { ApiProperty } from "@nestjs/swagger";


export class CreateProductInventoryDto {
	@ApiProperty()
	productId?: string;

	@ApiProperty()
	quantity?: number;

	@ApiProperty()
	image?: string;

	@ApiProperty()
	price?: string;

}
