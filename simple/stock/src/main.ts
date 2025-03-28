import "dotenv/config";

import apm from "elastic-apm-node";
import { OrderPlacedUseCase } from "./application/usecase/order-placed.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  apm.start({
    serviceName: "stock",
    secretToken: "supersecrettoken",
    serverUrl: "http://192.168.15.24:8200",
    environment: "development",
    active: true,
    captureBody: "all",
    captureErrorLogStackTraces: "always",
    captureExceptions: true,
    captureHeaders: true,
  });
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
