import {Request,Response,NextFunction} from 'express'
import fileService from '../services/hall.service'
import hallService from '../services/hall.service'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error'


export default new class HallController{
        
    async createHall(req:Request,res:Response,next:NextFunction){
        try{

            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const {hallNumber} = req.body

            const hall = hallService.createHall(hallNumber)
            return res.json(`Зал ${hall} создан`)
        }catch(e){
            next(e)
        }
    }

    async getAll(req:Request,res:Response,next:NextFunction){
        try{
            const halls = await hallService.getAll()
            return res.json(halls)
        }catch(e){
            next(e)
        }
         
    }
    
    async getHallByNumber(req:Request,res:Response, next:NextFunction){
        try{
            const {number} = req.params
        
            const hall = await fileService.getHallByNumber(Number(number))
    
            return res.json(hall)
        }catch(e){
            next(e)
        }
        
    }

    async updateHall(req:Request,res:Response,next:NextFunction){
        

        try{
            const hall = await hallService.updateHall(Number(req.params.number),req.body)
            return res.json(JSON.parse(hall))

        }catch(e) {
            next(e)
        }

    }

    async deleteHall(req:Request,res:Response,next:NextFunction){
        try{

            const {number} = req.params

            const result = await hallService.deleteHall(Number(number))

            return res.json(result)
        }catch(e){
            next(e)
        }
    }
}

