import Order from "src/domain/Order";
import { OrderRepository } from "../repositories/order.repository";

export default class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    return this.orderRepository.getById(id);
  }
}
