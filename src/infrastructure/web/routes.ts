import { type Request, type Response, Router } from 'express'
import { EvaluationController } from './controllers/evaluation-controller'
import { Container } from '../../di'
import { OrderController } from './controllers/order-controller'
import { asyncHandler } from './middleware/async-handler'

const evaluationController = new EvaluationController(
  Container.getEvaluationRepository(),
)
const orderController = new OrderController(Container.getOrderRepository())

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

export default router
