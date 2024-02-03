import {Request,Response,NextFunction} from 'express'
import bookingService from '../services/booking.service'

export default new class BookingController{
    
    async createOrder(req:Request,res:Response,next:NextFunction){

        try{
            const {sessionId} = req.params
            const {seatsId,email} = req.body

            const order = await bookingService.createBooking(+sessionId,email,seatsId)
    
            return res.json(order)
            
        }catch(e){
            next(e)
        }
        


    }
}
