import { OrderPlacedUseCase } from "./application/usecase/order-placed.usecase";
import { OrderSuccessUseCase } from "./application/usecase/order-success.usecase";
import { PaymentApprovedUseCase } from "./application/usecase/payment-approved.usecase";
import { StockAvailableUseCase } from "./application/usecase/stock-available.usecase";
import RabbitMQAdapter from "./infra/queue/RabbitMQ.adapter";

async function main() {
  const queue = new RabbitMQAdapter();
  await queue.connect();

  const orderPlacedUseCase = new OrderPlacedUseCase();
  const stockAvailableUseCase = new StockAvailableUseCase();
  const paymentApprovedUseCase = new PaymentApprovedUseCase();
  const orderSuccessUseCase = new OrderSuccessUseCase();

  queue.consumeExchange(
    "business_events",
    "order.placed",
    "notification_order_placed",
    async (data) => {
      await orderPlacedUseCase.execute(data);
    }
  );

  queue.consumeExchange(
    "business_events",
    "stock.available",
    "notification_stock_available",
    async (data) => {
      await stockAvailableUseCase.execute(data);
    }
  );

  queue.consumeExchange(
    "business_events",
    "payment.approved",
    "notification_payment_approved",
    async (data) => {
      await paymentApprovedUseCase.execute(data);
    }
  );

  queue.consumeExchange(
    "business_events",
    "order.success",
    "notification_order_success",
    async (data) => {
      await orderSuccessUseCase.execute(data);
    }
  );
}
main();
