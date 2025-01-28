import { Queue } from "../../infra/queue/Queue";
import Order from "../../domain/Order";
import { OrderRepository } from "../repositories/order.repository";
import crypto from "crypto";

export type OrderDTO = {
  product: string;
  price: number;
  quantity: number;
};

export type OrderPlacedEvent = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class CreateOrderUseCase {
  constructor(
    readonly queue: Queue,
    readonly orderRepository: OrderRepository
  ) {}

  async execute(data: OrderDTO): Promise<string> {
    const order = Order.create(data.product, data.price, data.quantity);

    const orderPlacedEvent = {
      orderId: order.orderId,
      product: order.product,
      price: order.price,
      quantity: order.quantity,
    };

    order.addEvent({ ...orderPlacedEvent, event: "order.placed" });

    await this.orderRepository.save(order);

    await this.queue.publishExchange(
      "business_events",
      "order.placed",
      orderPlacedEvent,
      crypto.randomUUID()
    );

    return order.orderId;
  }
}
