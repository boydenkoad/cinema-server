import {Request,Response,NextFunction} from 'express'
import sessionService from '../services/session.service'


export default new class SessionController{
    
    async createSession(req:Request,res:Response,next:NextFunction){
        try{
            const {movieId,hallNumber,date,time,prices} = req.body

            console.log(req.body)

            const session = await sessionService.create(movieId,hallNumber,date,time,prices)
    
            return res.json(session)
        }catch(e){
            next(e)
        }    
    }

    async getAll(req:Request,res:Response,next:NextFunction){
        try{
            const sessions = await sessionService.getAll()

            return res.json(sessions)

        }catch(e){
            next(e)
        }
    }

}