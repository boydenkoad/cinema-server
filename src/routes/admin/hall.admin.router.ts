import { Router } from 'express'
import hallController from '../../controllers/hall.controller'
import {body} from 'express-validator'

const router = Router()


router.post('/',
body('hallNumber')
.isLength({min:1})
.isNumeric(), hallController.createHall)

router.get('/:number',hallController.getHallByNumber)
router.patch('/:number',hallController.updateHall)
router.delete('/:number',hallController.deleteHall)

export default router

