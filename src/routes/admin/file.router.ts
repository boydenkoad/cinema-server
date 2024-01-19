import { Router } from 'express'
import fileController from '../../controllers/file.controller'

const router = Router()

router.post('/upload',fileController.uploadFile)


export default router