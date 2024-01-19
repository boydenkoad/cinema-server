import {Request,Response,NextFunction} from 'express'
import userService from '../services/user.service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'
import tokenService from '../services/token.service'

export default new class UserController{
    
    async getAll(req:Request,res:Response,next:NextFunction){
        
        const users = await userService.getAll()
        
        return res.json(users)
    }

    async getOne(req:Request,res:Response,next:NextFunction){
        const {id} = req.params
        
        try{
            const user  = await userService.getOne(Number(id))

            return res.json(user)

        }catch(e){
            next(e)
        }
    }

    async login(req:Request,res:Response,next:NextFunction){
        try{
            
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const {login,password} = req.body

            const token = await userService.login(login,String(password))

            res.cookie('refreshToken',token.refreshToken,{httpOnly:true})

            return res.json(token)

        }catch(e){

            next(e)

        }
    
    }

    async create(req:Request,res:Response,next:NextFunction){

        
        try{

            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const {login,password} = req.body
            
            const user = await userService.create(login,String(password))

            return res.json(user)

        }catch(e){

            next(e)

        }
        
    }

    async logout(req:Request,res:Response,next:NextFunction){
        try{
            const {refreshToken} = req.cookies

            const data = await userService.logout(refreshToken)

            res.clearCookie('refreshToken')

            return res.json({message:'Выход'})

        }catch(e){
            next(e)
        }


        
    }

    async activateUser(req:Request,res:Response,next:NextFunction){
        
        const {id} = req.params
        
        try{
            const user = await userService.activateUser(Number(id))
    
            return res.json(user)

        }catch(e){
            next(e)
        }
       

        
    }

    async refreshToken(req:Request,res:Response,next:NextFunction){
        try{
            const {refreshToken} = req.cookies

            const token = await userService.refreshToken(refreshToken)

            res.cookie('refreshToken',token.refreshToken,{httpOnly:true})

            return res.json(token)


        }catch(e){
            next(e)
        }
    }
}