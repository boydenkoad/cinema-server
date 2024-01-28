import { Router } from 'express'
import sessionController from '../../controllers/session.controller'


const router = Router()



router.get('/:date',sessionController.getByDate)
router.get('/:date/:slug',sessionController.getByDateAndMovieSlug)
router.get('/select/:sessionId',sessionController.getSession)

export default router