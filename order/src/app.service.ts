import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OrderDTO } from './dtos/orders.dto';

@Injectable()
export class AppService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: 'business_events',
    routingKey: 'stock.available',
    queue: 'payment_queue',
  })
  async execute(data: OrderDTO): Promise<void> {
    console.log(
      `Solicitação de pagamento Recebida: ${JSON.stringify(data)}.\n`,
    );

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const sleepTime = Math.floor(Math.random() * 15000);

    await sleep(sleepTime);

    this.amqpConnection.publish('business_events', 'order.success', data);
  }
}
