import {Router} from 'express'
import movieRouter from './movie.router'
import sessionRouter from './session.router'
import authRouter from './auth.router'
import bookingRouter from './booking.router'

const router = Router()

router.use('/sessions',sessionRouter)
router.use('/movies',movieRouter)
router.use('/auth',authRouter)
router.use('/booking',bookingRouter)

export default router