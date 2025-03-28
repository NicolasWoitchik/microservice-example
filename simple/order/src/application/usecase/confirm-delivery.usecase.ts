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

export class DeliverySuccessUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: Input): Promise<void> {
    const transaction = apm.startTransaction("DeliverySuccessUseCase", {
      childOf: data.transactionId,
      links: [
        {
          context: data.span,
        },
      ],
    });

    console.log("ConfirmDeliveryUseCase", data);
    const order = await this.orderRepository.getById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.confimedDelivery();

    order.addEvent({ ...data, event: "delivery.created" });

    await this.orderRepository.update(order);
    transaction.end();
  }
}
