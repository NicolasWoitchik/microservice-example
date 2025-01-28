import crypto from "crypto";

export default class Order {
  constructor(
    readonly orderId: string,
    readonly product: string,
    readonly price: number,
    readonly quantity: number,
    private status: string,
    private readonly events: Record<string, any>[] = []
  ) {}

  confirm() {
    this.status = "waiting_delivery";
  }

  confimedStock() {
    this.status = "waiting_payment";
  }

  confimedDelivery() {
    this.status = "success";
  }

  getStatus() {
    return this.status;
  }

  addEvent(event: Record<string, any>) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  static create(product: string, price: number, quantity: number) {
    const orderId = crypto.randomUUID();
    const status = "waiting_stock";
    return new Order(orderId, product, price, quantity, status);
  }
}
