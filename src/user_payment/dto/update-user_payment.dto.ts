import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPaymentDto } from './create-user_payment.dto';

export class UpdateUserPaymentDto extends PartialType(CreateUserPaymentDto) {}
