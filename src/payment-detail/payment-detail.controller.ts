import { Controller } from '@nestjs/common';
import { PaymentDetailService } from './payment-detail.service';

@Controller('payment-detail')
export class PaymentDetailController {
  constructor(private readonly paymentDetailService: PaymentDetailService) {}
}
