import { Queue } from "src/infra/queue/Queue";
import { OrderRepository } from "../repositories/order.repository";

export type Input = {
  orderId: string;
  status: string;
  product: string;
  price: number;
  quantity: number;
};

export class ConfirmPaymentUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: Input, traceId?: string): Promise<void> {
    const order = await this.orderRepository.getById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.confirm();

    order.addEvent(data);

    await this.orderRepository.update(order);

    await this.queue.publishExchange(
      "business_events",
      "order.success",
      data,
      traceId
    );
  }
}
