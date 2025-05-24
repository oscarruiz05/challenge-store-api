export class Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    stock: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.stock = stock;
  }
}
