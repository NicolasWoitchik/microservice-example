import { OrderSuccessUseCase } from "./application/usecase/order-success.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();

  const orderSuccessUseCase = new OrderSuccessUseCase(queue);

  queue.consumeExchange(
    "business_events",
    "order.success",
    "delivery_order_success",
    async (data, traceId) => {
      await orderSuccessUseCase.execute(data, traceId);
    }
  );
}
main();
