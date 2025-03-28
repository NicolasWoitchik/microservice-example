import "dotenv/config";

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  CreateOrderUseCase,
  OrderDTO,
} from "./application/usecase/create-order.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";
import { startConsumers } from "./consumers";
import { OrderRepositoryMongoDB } from "./infra/repositories/order.repository";
import GetOrderByIdUseCase from "./application/usecase/get-order-by-id.usecase";
import apm, { middleware } from "elastic-apm-node";

export const logger = apm.logger;

async function main() {
  apm.start({
    serviceName: "order",
    secretToken: "supersecrettoken",
    serverUrl: "http://192.168.15.24:8200",
    environment: "development",
    active: true,
    captureBody: "all",
    captureErrorLogStackTraces: "always",
    captureExceptions: true,
    captureHeaders: true,
  });

  const app = express();

  const middle = middleware.connect();

  app.use(middle);

  const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";

  const queue = new RabbitMQAdapter();
  const orderRepository = new OrderRepositoryMongoDB();
  const createOrderUseCase = new CreateOrderUseCase(queue, orderRepository);
  const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);

  await mongoose.connect(mongoUrl);
  await queue.connect();

  await startConsumers(queue, orderRepository);

  app.use(express.json());

  app.get("/order/:id", async (req: Request, res: Response): Promise<any> => {
    console.log("Request: Get Order By Id", req.params.id);
    const order = await getOrderByIdUseCase.execute(req.params.id);

    return res.json(order);
  });

  app.post("/order", async (req: Request, res: Response): Promise<any> => {
    console.log("Request: Create Order", req.body);

    const input: OrderDTO = {
      product: req.body.product,
      price: req.body.price,
      quantity: req.body.quantity,
    };

    const orderId = await createOrderUseCase.execute(input);

    return res.json({
      order_id: orderId,
      status: "created",
    });
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
main().catch(console.log);
