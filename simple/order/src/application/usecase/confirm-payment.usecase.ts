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

    order.addEvent({ ...data, event: "payment.approved" });
    order.addEvent({ ...data, event: "order.success" });

    await this.orderRepository.update(order);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    await this.queue.publishExchange(
      "business_events",
      "order.success",
      data,
      traceId
    );
  }
}
