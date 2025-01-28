import { OrderPlacedUseCase } from "./application/usecase/order-placed.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();

  const orderPlacedUseCase = new OrderPlacedUseCase(queue);

  queue.consumeExchange(
    "business_events",
    "order.placed",
    "stock_order_placed",
    async (data, traceId) => {
      await orderPlacedUseCase.execute(data, traceId);
    }
  );
}

main();
