import { Module } from '@nestjs/common';
import { PaymentService } from './infrastructure/services/payment.service';

@Module({
    providers: [
        {
            provide: 'PaymentGateway',
            useClass: PaymentService
        }
    ],
    exports: ['PaymentGateway']
})
export class PaymentsModule {}
