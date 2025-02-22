import { OrderRepository } from "./application/repositories/order.repository";
import { DeliverySuccessUseCase } from "./application/usecase/confirm-delivery.usecase";
import { ConfirmPaymentUseCase } from "./application/usecase/confirm-payment.usecase";
import { ConfirmStockUseCase } from "./application/usecase/confirm-stock.usecase";
import { Queue } from "./infra/queue/Queue";

export async function startConsumers(
  queue: Queue,
  orderRepository: OrderRepository
): Promise<void> {
  console.log("Consumers started");

  const confirmStockUseCase = new ConfirmStockUseCase(queue, orderRepository);

  const confirmPaymentUseCase = new ConfirmPaymentUseCase(
    queue,
    orderRepository
  );

  const deliveryOrderSuccessUseCase = new DeliverySuccessUseCase(
    queue,
    orderRepository
  );

  queue.consumeExchange(
    "business_events",
    "stock.available",
    "order_stock_available",
    async (data) => {
      await confirmStockUseCase.execute(data);
    }
  );

  queue.consumeExchange(
    "business_events",
    "payment.approved",
    "order_payment_approved",
    async (data) => {
      await confirmPaymentUseCase.execute(data);
    }
  );

  queue.consumeExchange(
    "business_events",
    "delivery.created",
    "order_delivery_success",
    async (data) => {
      await deliveryOrderSuccessUseCase.execute(data);
    }
  );
}
