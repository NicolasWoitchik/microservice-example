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

export class ConfirmStockUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: Input): Promise<void> {
    const transaction = apm.startTransaction("ConfirmStockUseCase", {
      childOf: data.transactionId,
      links: [
        {
          context: data.span,
        },
      ],
    });
    console.log("ConfirmStockUseCase", data);
    const order = await this.orderRepository.getById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.confimedStock();

    order.addEvent({ ...data, event: "stock.available" });

    await this.orderRepository.update(order);
    transaction.end();
  }
}
