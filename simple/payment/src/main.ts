import "dotenv/config";

import apm from "elastic-apm-node";
import { StockAvailableUseCase } from "./application/usecase/stock-available.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  apm.start({
    serviceName: "payment",
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

  const stockAvailableUseCase = new StockAvailableUseCase(queue);

  queue.consumeExchange(
    "business_events",
    "stock.available",
    "payment_stock_available",
    async (data, traceId) => {
      await stockAvailableUseCase.execute(data, traceId);
    }
  );
}
main();
