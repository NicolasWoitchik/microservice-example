import { model, Document, Schema } from "mongoose";
import { OrderRepository } from "../../application/repositories/order.repository";
import Order from "../../domain/Order";

export class OrderRepositoryMongoDB implements OrderRepository {
  private orderModel: any;

  constructor() {
    const orderSchema = new Schema({
      _id: String,
      product: String,
      price: Number,
      quantity: Number,
      status: String,
      events: Array,
    });

    this.orderModel = model<OrderDocument>("orders", orderSchema);
  }

  async save(order: Order): Promise<void> {
    const orderDocument = new this.orderModel(order);
    await orderDocument.save();
  }

  async update(order: Order): Promise<void> {
    await this.orderModel.updateOne({ _id: order.orderId }, { $set: order });
  }

  async getById(id: string): Promise<Order> {
    const orderDocument = await this.orderModel.findOne({ _id: id });
    return orderDocument
      ? new Order(
          orderDocument._id,
          orderDocument.product,
          orderDocument.price,
          orderDocument.quantity,
          orderDocument.status
        )
      : null;
  }
}

interface OrderDocument extends Document {
  _id: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
  events: Record<string, any>[];
}
