import { Order } from '../../domain/types/order'
import { OrderFilter } from '../../domain/filters/order-filter'
import { Paginated } from '../../domain/types/paginated'

export interface OrderRepository {
  save(order: Order): Promise<Order>
  findLast(symbol: string): Promise<Order | null>
  list(filters: OrderFilter): Promise<Paginated<Order>>
}
