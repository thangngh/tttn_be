import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDetailEntity } from './entities/payment-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentDetailService {

	constructor(
		@InjectRepository(PaymentDetailEntity)
		private readonly paymentDetailRepository: Repository<PaymentDetailEntity>,
	) { }
}
