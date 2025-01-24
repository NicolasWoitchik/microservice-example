import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  CreateOrderUseCase,
  OrderDTO,
} from "./application/usecase/create-order.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";
import { startConsumers } from "./consumers";
import { OrderRepositoryMongoDB } from "./infra/repositories/order.repository";

async function main() {
  const app = express();

  await mongoose.connect("mongodb://microservice:example@localhost:27017");

  const queue = new RabbitMQAdapter();
  const orderRepository = new OrderRepositoryMongoDB();
  await queue.connect();
  await startConsumers(queue, orderRepository);

  const createOrderUseCase = new CreateOrderUseCase(queue, orderRepository);

  app.use(express.json());

  app.post("/order", async (req: Request, res: Response): Promise<any> => {
    console.log("Request: Create Order", req.body);

    const input: OrderDTO = {
      product: req.body.name,
      price: req.body,
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
main();
