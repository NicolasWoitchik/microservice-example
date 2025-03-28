import "dotenv/config";

import apm from "elastic-apm-node";
import { OrderSuccessUseCase } from "./application/usecase/order-success.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  apm.start({
    serviceName: "delivery",
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
