import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GoogleDto {

	@ApiProperty()
	@IsOptional()
	accessToken!: string;

}