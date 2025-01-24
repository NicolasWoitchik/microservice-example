type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class StockAvailableUseCase {
  async execute(data: Input): Promise<void> {
    console.log("StockAvailableUseCase", data);
  }
}
