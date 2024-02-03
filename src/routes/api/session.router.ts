import { Router } from 'express'
import sessionController from '../../controllers/session.controller'
import bookingController from '../../controllers/booking.controller'


const router = Router()



router.get('/:date',sessionController.getSessionByDate)
router.get('/select/hall/:sessionId',sessionController.getSessionById)
router.post('/select/hall/:sessionId',bookingController.createOrder)
router.get('/:date/:slug',sessionController.getByDateAndMovieSlug)

export default router