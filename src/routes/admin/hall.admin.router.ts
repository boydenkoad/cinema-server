import { Router } from 'express'
import hallController from '../../controllers/hall.controller'


const router = Router()

// router.get('/',hallController)

router.get('/:number',hallController.getFile)
router.patch('/:number',hallController.updateHall)

export default router