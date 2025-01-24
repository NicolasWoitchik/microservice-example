export interface Queue {
  connect(): Promise<void>;
  consume(queueName: string, callback: Function): Promise<void>;
  consumeExchange(
    exchangeName: string,
    routingKey: string,
    queueName: string,
    callback: Function
  ): Promise<void>;
  publish(queueName: string, data: any): Promise<void>;
  publishExchange(
    exchangeName: string,
    routingKey: string,
    data: any,
    traceId?: string
  ): Promise<void>;
}
