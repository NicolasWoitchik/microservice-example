import { Queue } from "../../infra/queue/Queue";
import Order from "../../domain/Order";
import { OrderRepository } from "../repositories/order.repository";
import { logger } from "../../../src/main";
import apm from "elastic-apm-node";

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
    const transaction = apm.startTransaction("CreateOrderUseCase");
    const traceId = transaction.ids["trace.id"];

    console.log("CreateOrderUseCase", data);
    const order = Order.create(data.product, data.price, data.quantity);

    const span = transaction.startSpan("span-tesst");

    const orderPlacedEvent = {
      orderId: order.orderId,
      product: order.product,
      price: order.price,
      quantity: order.quantity,
      traceId,
      transactionId: transaction.ids["transaction.id"],
      span: {
        traceId: span.ids["trace.id"],
        spanId: span.ids["span.id"],
      },
    };

    order.addEvent({ ...orderPlacedEvent, event: "order.placed" });

    await this.orderRepository.save(order);

    logger.info(orderPlacedEvent);

    transaction.addLabels({
      orderId: order.orderId,
    });

    transaction.setOutcome("success");
    transaction.addLink({
      context: {
        traceId: orderPlacedEvent.traceId,
        spanId: order.orderId,
      },
    });

    await this.queue.publishExchange(
      "business_events",
      "order.placed",
      orderPlacedEvent,
      traceId
    );

    transaction.end();

    return order.orderId;
  }
}
