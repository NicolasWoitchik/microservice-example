import apm from "elastic-apm-node";
import { Queue } from "src/infra/queue/Queue";

type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
  transactionId: string;
  span: { traceId: string; spanId: string };
};

export class OrderPlacedUseCase {
  constructor(readonly queue: Queue) {}

  async execute(data: Input, traceId: string): Promise<void> {
    const transaction = apm.startTransaction("OrderPlacedUseCase", {
      childOf: data.transactionId,
      links: [
        {
          context: data.span,
        },
      ],
    });
    console.log("OrderPlacedUseCase", data);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await this.queue.publishExchange(
      "business_events",
      "stock.available",
      data,
      traceId
    );

    transaction.end();
  }
}
