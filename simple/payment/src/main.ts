import { StockAvailableUseCase } from "./application/usecase/stock-available.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();

  const stockAvailableUseCase = new StockAvailableUseCase(queue);

  queue.consumeExchange(
    "bussiness_events",
    "payment.approved",
    "payment_stock_available",
    async (data, traceId) => {
      await stockAvailableUseCase.execute(data, traceId);
    }
  );
}
main();
