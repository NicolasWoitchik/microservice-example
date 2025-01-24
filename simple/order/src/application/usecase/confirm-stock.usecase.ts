import { Queue } from "src/infra/queue/Queue";
import { OrderRepository } from "../repositories/order.repository";

export type Input = {
  orderId: string;
  status: string;
  product: string;
  price: number;
  quantity: number;
};

export class ConfirmStockUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: Input): Promise<void> {
    const order = await this.orderRepository.getById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.confimedStock();

    order.addEvent(data);

    await this.orderRepository.update(order);
  }
}
