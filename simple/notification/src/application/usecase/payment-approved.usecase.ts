type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class PaymentApprovedUseCase {
  async execute(data: Input): Promise<void> {
    console.log("PaymentApprovedUseCase", data);
  }
}
