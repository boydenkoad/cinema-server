import { Router } from 'express'
import sessionController from '../../controllers/session.controller'


const router = Router()



router.post('/',sessionController.createSession)
router.get('/',sessionController.getAll)


export default router