export class Customer {
  id: string;
  name: string;
  last_name: string;
  email: string;
  number_phone: string;
  address: string;

  constructor(
    id: string,
    name: string,
    last_name: string,
    email: string,
    number_phone: string,
    address: string,
  ) {
    this.id = id;
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.number_phone = number_phone;
    this.address = address;
  }
}
