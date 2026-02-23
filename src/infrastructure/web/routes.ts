import { type Request, type Response, Router } from 'express'
import { EvaluationController } from './controllers/evaluation-controller'
import { Container } from '../../di'
import { OrderController } from './controllers/order-controller'
import { asyncHandler } from './middleware/async-handler'
import { PositionController } from './controllers/position-controller'
import { PerformanceController } from './controllers/performance-controller'

const evaluationController = new EvaluationController(
  Container.getEvaluationRepository(),
)
const orderController = new OrderController(Container.getOrderRepository())
const positionController = new PositionController(
  Container.getPositionRepository(),
)
const performanceController = new PerformanceController(
  Container.getPerformanceRepository(),
)

const router: Router = Router()

router.get('/', (_: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (_: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

router.get(
  '/evaluations',
  asyncHandler((request: Request, response: Response) =>
    evaluationController.getEvaluations(request, response),
  ),
)

router.get(
  '/orders',
  asyncHandler((request: Request, response: Response) =>
    orderController.getOrders(request, response),
  ),
)

router.get(
  '/positions',
  asyncHandler((request: Request, response: Response) =>
    positionController.getPositions(request, response),
  ),
)

router.get(
  '/performance',
  asyncHandler((request: Request, response: Response) =>
    performanceController.getPerformance(request, response),
  ),
)

export default router
