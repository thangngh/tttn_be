import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	categoryId: number;

	@ApiProperty()
	@IsOptional()
	discountId: number;
}
