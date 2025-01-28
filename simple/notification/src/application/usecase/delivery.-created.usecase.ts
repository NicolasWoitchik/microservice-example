export type Input = {
  orderId: string;
  product: string;
  price: number;
  quantity: number;
};

export class DeliveryCreatedUseCase {
  async execute(data: Input) {
    console.log("DeliveryCreatedUseCase", data);
  }
}
