// import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDTO {
  // @ApiProperty()
  @IsOptional()
  page?: number;

  // @ApiProperty()
  @IsOptional()
  limit?: number;

  //   @ApiProperty()
  @IsOptional()
  search?: string;

  @IsOptional()
  role?: string

  @IsOptional()
  category?: string;
}