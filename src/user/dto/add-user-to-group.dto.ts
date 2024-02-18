import { ApiProperty } from "@nestjs/swagger"

export class addUserToGroupDto {
	@ApiProperty()
	groupId: string

	@ApiProperty()
	userId: string
}