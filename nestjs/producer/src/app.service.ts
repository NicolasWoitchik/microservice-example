import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { OrderDTO } from './dtos/orders.dto';

@Injectable()
export class AppService {
  constructor(private readonly amqpConnection: AmqpConnection) {
    this.execute();
  }

  async execute(): Promise<void> {
    const interval: number = parseInt(process.env.INTERVAL) || 500;

    setInterval(() => {
      if (!this.amqpConnection.connected) return;
      const data: OrderDTO = {
        id: v4(),
        name: 'MB Class',
        price: 1.5,
        quantity: 20,
        transaction_id: v4(),
      };

      console.log(`Emitindo ordem de compra: ${JSON.stringify(data)}.\n`);

      this.amqpConnection.publish('business_events', 'orders.created', data);
    }, interval);
  }
}
