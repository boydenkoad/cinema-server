import {Router} from 'express'
import movieRouter from './movie.router'
import sessionRouter from './session.router'
import userRouter from './user.router'

const router = Router()

router.use('/movies',movieRouter)
router.use('/sesssions',sessionRouter)
router.use('/users',userRouter)

export default router