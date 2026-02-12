import { Container } from '../../di'
import { PositionRepository } from '../../application/repositories/position-repository'
import { Position } from '../../domain/types/position'
import { OrderRepository } from '../../application/repositories/order-repository'
import { Order } from '../../domain/types/order'

export default async function (): Promise<void> {
  const symbol = 'ETHUSDC'
  const quantity = 0.01
  const price = 1978.52

  const orderRepository: OrderRepository = Container.getOrderRepository()

  const fakeOrder: Order = {
    exchangeOrderId: '1000000000001',
    symbol: symbol,
    side: 'BUY',
    quantity: quantity,
    price: price,
    cost: 197.852,
    fees: 0.00021212,
  }

  const fakeOrderCreated: Order = await orderRepository.save(fakeOrder)

  const positionRepository: PositionRepository =
    Container.getPositionRepository()

  const fakePosition: Position = {
    symbol: 'ETHUSDC',
    status: 'OPEN',
    quantity: quantity,
    entryPrice: price,
    entryTime: new Date(),
    buyOrderId: fakeOrderCreated.id!,
  }

  await positionRepository.save(fakePosition)
}
