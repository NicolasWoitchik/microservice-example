import apm from "elastic-apm-node";
import { Queue } from "src/infra/queue/Queue";

export type StockAvailableEvent = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;

  transactionId: string;
  span: { traceId: string; spanId: string };
};

export class StockAvailableUseCase {
  constructor(readonly queue: Queue) {}

  async execute(data: StockAvailableEvent, traceId: string): Promise<void> {
    const transaction = apm.startTransaction("StockAvailableUseCase", {
      childOf: data.transactionId,
      links: [
        {
          context: data.span,
        },
      ],
    });
    console.log("StockAvailableUseCase", data);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    await this.queue.publishExchange(
      "business_events",
      "payment.approved",
      data,
      traceId
    );
    transaction.end();
  }
}
