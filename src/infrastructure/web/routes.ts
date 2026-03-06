import { type Request, type Response, Router } from 'express'
import { EvaluationController } from './controllers/evaluation-controller'
import { OrderController } from './controllers/order-controller'
import { asyncHandler } from './middleware/async-handler'
import { PositionController } from './controllers/position-controller'
import { PerformanceController } from './controllers/performance-controller'
import { PortfolioController } from './controllers/portfolio-controller'
import { ActivityController } from './controllers/activity-controller'

export const createRouter = (
  evaluationController: EvaluationController,
  orderController: OrderController,
  positionController: PositionController,
  performanceController: PerformanceController,
  portfolioController: PortfolioController,
  activityController: ActivityController,
): Router => {
  const router: Router = Router()

  router.get('/', (_: Request, res: Response): void => {
    res.send({})
  })

  router.get('/uptime', (_: Request, res: Response): void => {
    res.send({ data: process.uptime() })
  })

  router.get(
    '/evaluations',
    asyncHandler((req, res) => evaluationController.getEvaluations(req, res)),
  )
  router.get(
    '/orders',
    asyncHandler((req, res) => orderController.getOrders(req, res)),
  )
  router.get(
    '/positions',
    asyncHandler((req, res) => positionController.getPositions(req, res)),
  )
  router.get(
    '/performance',
    asyncHandler((req, res) => performanceController.getPerformance(req, res)),
  )
  router.get(
    '/portfolio',
    asyncHandler((req, res) => portfolioController.getPortfolio(req, res)),
  )
  router.get(
    '/activities',
    asyncHandler((req, res) => activityController.getActivities(req, res)),
  )

  return router
}
