import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class AuthCredentialsDto {
    @ApiProperty()
    @IsOptional()
    readonly firstName: string;

    @ApiProperty()
    @IsOptional()
    readonly lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsOptional()
    readonly username: string;

    @ApiProperty()
    @IsOptional()
    readonly password: string;

    // @IsOptional()
    // readonly providerType?: ProviderType;
}
