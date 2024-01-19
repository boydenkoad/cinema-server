import { Router } from 'express'
import movieController from '../controllers/movie.controller'



const router = Router()

router.get('/',movieController.getAll)

router.get('/:slug',movieController.getBySlug)

export default router