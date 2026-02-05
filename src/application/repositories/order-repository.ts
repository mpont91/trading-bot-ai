import { Order } from '../../domain/types/order'

export interface OrderRepository {
  save(order: Order): Promise<Order>
}
