import { Router } from 'express'
import  userController  from '../controllers/user.controller'
import {body} from 'express-validator'

const router = Router()

router.get('/refresh',userController.refreshToken)

router.post('/registration',
body('login').isLength({min:4}),
body('password').isLength({min:4}),
userController.create)

router.post('/login',body('login').isLength({min:4}),body('password').isLength({min:4}),userController.login)

router.post('/logout',userController.logout)

export default router