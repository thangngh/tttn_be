import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FacebookDto {
	@ApiProperty()
	@IsOptional()
	accessToken!: string;

	@ApiProperty()
	@IsOptional()
	facebookAddress!: string;

	@ApiProperty()
	@IsOptional()
	name!: string;
}