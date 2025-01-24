import amqp, { Connection } from "amqplib";
import { Queue } from "./Queue";

export default class RabbitMQAdapter implements Queue {
  connection: Connection;

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://rabbitmq:rabbitmq@localhost");
  }

  async consume(queueName: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      await callback(input);
      channel.ack(msg);
    });
  }

  async consumeExchange(
    exchangeName: string,
    routingKey: string,
    queueName: string,
    callback: Function
  ): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);
    await channel.consume(queueName, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      await callback(input, msg.headers.trace_id);
      channel.ack(msg);
    });
  }

  async publish(queueName: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  }

  async publishExchange<T>(
    exchangeName: string,
    routingKey: string,
    data: T,
    traceId?: string
  ): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: true });
    await channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { headers: { trace_id: traceId || crypto.randomUUID() } }
    );
  }
}
