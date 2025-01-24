import { Queue } from "src/infra/queue/Queue";

type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class OrderSuccessUseCase {
  constructor(readonly queue: Queue) {}

  async execute(data: Input, traceId: string): Promise<void> {
    console.log("OrderSuccessUseCase", data);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    await this.queue.publishExchange(
      "business_events",
      "delivery.created",
      data,
      traceId
    );
  }
}
