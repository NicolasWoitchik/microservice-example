type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class OrderSuccessUseCase {
  async execute(data: Input): Promise<void> {
    console.log("OrderSuccessUseCase", data);
  }
}
