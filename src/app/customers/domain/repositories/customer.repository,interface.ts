import { Customer } from "../models/customer.model";

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
}