import Order from "src/domain/Order";

export interface OrderRepository {
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  getById(id: string): Promise<Order>;
}
