import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OrderDTO } from './dtos/orders.dto';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class AppService {
  constructor() {}

  @RabbitSubscribe({
    exchange: 'business_events',
    routingKey: ['orders.#', 'stock.#', 'order.#'],
    queue: 'notification_queue',
  })
  async ordersEventsHandler(
    data: OrderDTO,
    test: ConsumeMessage,
  ): Promise<void> {
    console.log(
      `[${test.fields.routingKey}] Notificação Recebida: ${JSON.stringify(data)}.\n`,
    );

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(1000);
  }
}
