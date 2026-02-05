import { Container } from '../../di'
import { OrderRepository } from '../../application/repositories/order-repository'
import { Order } from '../../domain/types/order'

export default async function (): Promise<void> {
  const orderRepository: OrderRepository = Container.getOrderRepository()
  const fakeOrder: Order = {
    exchangeOrderId: '1000000000001',
    symbol: 'ETHUSDC',
    side: 'SELL',
    quantity: 0.1,
    price: 1978.52,
    cost: 197.852,
    fees: 0.00021212,
  }

  await orderRepository.save(fakeOrder)
}
