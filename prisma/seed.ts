import { faker } from '@faker-js/faker'
import { TimeFrame } from '../src/domain/types/time-frame'
import { AdviceAction } from '../src/domain/types/advice'
import { Container } from '../src/di'
import { OrderSide } from '../src/domain/types/order'
import { prisma } from '../src/infrastructure/db/prisma-client'
import { PositionStatus } from '../src/domain/types/position'

const settings = Container.getSettings()
const TOTAL_POSITIONS_CLOSED = 50
const now = new Date()
const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

async function main() {
  console.log('🌱  Initializing seeding...')

  await reset()

  await PositionsClosed()

  await positionsOpened()
}

async function reset() {
  console.log('Deleting all data...')
  await prisma.position.deleteMany()
  await prisma.order.deleteMany()
  await prisma.evaluation.deleteMany()
}

async function PositionsClosed() {
  console.log('Creating closed positions...')
  for (let i = 0; i < TOTAL_POSITIONS_CLOSED; i++) {
    const symbol = faker.helpers.arrayElement(settings.strategy.symbols)
    const quantity = faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 })
    const entryPrice = faker.number.float({
      min: 100,
      max: 60000,
      fractionDigits: 2,
    })
    const entryTime = faker.date.between({
      from: sixtyDaysAgo,
      to: fiveDaysAgo,
    })

    const buyOrderId = await createBuyLeg(
      symbol,
      quantity,
      entryPrice,
      entryTime,
    )

    const sellData = await createSellLeg(
      symbol,
      quantity,
      entryPrice,
      entryTime,
    )

    await prisma.position.create({
      data: {
        symbol,
        status: PositionStatus.CLOSED,
        quantity,
        entryPrice,
        entryTime,
        exitPrice: sellData.exitPrice,
        exitTime: sellData.exitTime,
        buyOrderId: buyOrderId,
        sellOrderId: sellData.sellOrderId,
        pnl: sellData.pnl,
        pnlPercent: sellData.pnlPercent,
      },
    })
  }
}

async function positionsOpened() {
  console.log('Creating opened positions...')

  for (const symbol of settings.strategy.symbols.slice(0, 3)) {
    const { quantity, price: entryPrice } = generateTradeData()
    const entryTime = faker.date.between({
      from: fourDaysAgo,
      to: now,
    })

    const buyOrderId = await createBuyLeg(
      symbol,
      quantity,
      entryPrice,
      entryTime,
    )

    await prisma.position.create({
      data: {
        symbol,
        status: PositionStatus.OPEN,
        quantity,
        entryPrice,
        entryTime,
        buyOrderId: buyOrderId,
      },
    })
  }
}

function generateTradeData() {
  return {
    quantity: faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 }),
    price: faker.number.float({ min: 100, max: 60000, fractionDigits: 2 }),
  }
}

async function createBuyLeg(
  symbol: string,
  quantity: number,
  price: number,
  time: Date,
): Promise<number> {
  const buyOrder = await prisma.order.create({
    data: {
      exchangeOrderId: faker.string.alphanumeric(10).toUpperCase(),
      symbol,
      side: OrderSide.BUY,
      quantity,
      price,
      cost: price * quantity,
      fees: price * quantity * 0.001,
      createdAt: time,
    },
  })

  await prisma.evaluation.create({
    data: {
      symbol,
      action: AdviceAction.BUY,
      timeFrame: String(TimeFrame['1h']),
      price: faker.number.float(),
      confidence: faker.number.float({ min: 0, max: 1 }),
      model: faker.string.alphanumeric(),
      reasoning: faker.lorem.sentence(),
      createdAt: time,
    },
  })

  return buyOrder.id
}

async function createSellLeg(
  symbol: string,
  quantity: number,
  entryPrice: number,
  entryTime: Date,
) {
  const exitTime = faker.date.between({ from: entryTime, to: fiveDaysAgo })
  const isWinner = faker.number.int({ min: 1, max: 100 }) <= 60
  const variation = faker.number.float({ min: 0.01, max: 0.15 })

  const exitPrice = isWinner
    ? entryPrice * (1 + variation)
    : entryPrice * (1 - variation)
  const pnl = (exitPrice - entryPrice) * quantity
  const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100

  const sellOrder = await prisma.order.create({
    data: {
      exchangeOrderId: faker.string.alphanumeric(10).toUpperCase(),
      symbol,
      side: OrderSide.SELL,
      quantity,
      price: exitPrice,
      cost: exitPrice * quantity,
      fees: exitPrice * quantity * 0.001,
      createdAt: exitTime,
    },
  })

  await prisma.evaluation.create({
    data: {
      timeFrame: String(TimeFrame['1h']),
      price: faker.number.float(),
      confidence: faker.number.float({ min: 0, max: 1 }),
      model: faker.string.alphanumeric(),
      symbol,
      action: AdviceAction.SELL,
      reasoning: faker.lorem.sentence(),
      createdAt: exitTime,
    },
  })

  return {
    sellOrderId: sellOrder.id,
    exitPrice,
    exitTime,
    pnl,
    pnlPercent,
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
