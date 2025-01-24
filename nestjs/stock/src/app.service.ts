import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OrderDTO } from './dtos/orders.dto';

@Injectable()
export class AppService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: 'business_events',
    routingKey: 'orders.created',
    queue: 'check_stock_availability_queue',
  })
  async execute(data: OrderDTO): Promise<void> {
    console.log(`Verificação de Stock Recebida: ${JSON.stringify(data)}.\n`);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const sleepTime = Math.floor(Math.random() * 10000);

    await sleep(sleepTime);

    this.amqpConnection.publish('business_events', 'stock.available', data);
  }
}
