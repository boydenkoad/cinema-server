import { Router } from 'express'

import {body} from 'express-validator'
import authMiddleware from '../../middlewares/auth.middleware'
import userController from '../../controllers/user.controller'


const router = Router()

router.get('/refresh',userController.refreshToken)

router.get('/',userController.getAll)

router.get('/:id',userController.getOne)

router.post('/registration',
body('login').isLength({min:4}),
body('password').isLength({min:4}),
userController.create)

router.patch('/:id',userController.activateUser)

router.post('/logout',userController.logout)

export default router