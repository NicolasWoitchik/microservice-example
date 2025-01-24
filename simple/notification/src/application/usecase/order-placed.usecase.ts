export type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class OrderPlacedUseCase {
  async execute(data: Input): Promise<void> {
    console.log("OrderPlacedUseCase", data);
  }
}
