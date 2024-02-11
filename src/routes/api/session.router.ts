import { Router } from 'express'
import sessionController from '../../controllers/session.controller'
import bookingController from '../../controllers/booking.controller'


const router = Router()
router.get('/',sessionController.getAll)
router.get('/:sessionId',sessionController.getSessionById)
router.post('/:sessionId',bookingController.createOrder)


export default router