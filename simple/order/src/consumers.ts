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

  queue.consumeExchange(
    "bussiness_events",
    "stock.available",
    "order_stock_available",
    async (data) => {
      await confirmStockUseCase.execute(data);
    }
  );

  const confirmPaymentUseCase = new ConfirmPaymentUseCase(
    queue,
    orderRepository
  );

  queue.consumeExchange(
    "bussiness_events",
    "payment.approved",
    "stock_payment_approved",
    async (data) => {
      await confirmPaymentUseCase.execute(data);
    }
  );

  const deliveryOrderSuccessUseCase = new DeliverySuccessUseCase(
    queue,
    orderRepository
  );

  queue.consumeExchange(
    "business_events",
    "delivery.created",
    "stock_delivery_success",
    async (data) => {
      await deliveryOrderSuccessUseCase.execute(data);
    }
  );
}
