import { model, Document, Schema, Model } from "mongoose";
import { OrderRepository } from "../../application/repositories/order.repository";
import Order from "../../domain/Order";

export class OrderRepositoryMongoDB implements OrderRepository {
  private readonly orderModel: Model<OrderDocument>;

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
    const orderDocument = new this.orderModel({
      _id: order.orderId,
      ...order,
    });
    await orderDocument.save();
  }

  async update(order: Order): Promise<void> {
    await this.orderModel.updateOne(
      { _id: order.orderId },
      {
        $set: {
          product: order.product,
          price: order.price,
          quantity: order.quantity,
          status: order.getStatus(),
          events: order.getEvents(),
        },
      }
    );
  }

  async getById(id: string): Promise<Order> {
    const orderDocument = await this.orderModel.findOne({ _id: id });
    return orderDocument
      ? new Order(
          orderDocument._id,
          orderDocument.product,
          orderDocument.price,
          orderDocument.quantity,
          orderDocument.status,
          orderDocument.events
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
