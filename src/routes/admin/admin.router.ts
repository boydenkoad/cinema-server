import { Router } from 'express'
import movieRouter from './movies.admin.router'
import genreRouter from './genres.admin.router'
import userRouter from './user.admin.router'
import hallRouter from './hall.admin.router'
import fileRouter from './file.router'
import sessionRouter from './session.admin.router'

const router = Router()

router.use('/movies',movieRouter)
router.use('/genres',genreRouter)
router.use('/users',userRouter)
router.use('/halls',hallRouter)
router.use('/files',fileRouter)
router.use('/sessions',sessionRouter)

export default router