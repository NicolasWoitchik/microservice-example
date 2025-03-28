import { Queue } from "src/infra/queue/Queue";
import { OrderRepository } from "../repositories/order.repository";
import apm from "elastic-apm-node";

export type Input = {
  orderId: string;
  status: string;
  product: string;
  price: number;
  quantity: number;

  transactionId: string;
  span: { traceId: string; spanId: string };
};

export class ConfirmPaymentUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: Input, traceId?: string): Promise<void> {
    const transaction = apm.startTransaction("ConfirmPaymentUseCase", {
      childOf: data.transactionId,
      links: [
        {
          context: data.span,
        },
      ],
    });
    console.log("ConfirmPaymentUseCase", data);
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
    transaction.end();
  }
}
