import mailService from "./mail.service"
import {pool as db} from '../db/db'
import { queryConstructor } from "../shared/query.constructor"
import seatService from "./seat.service"
import ApiError from "../exceptions/api-error"
import {ISeatDb} from "../db/entities/seatDb.entity"
import { IBookingDb } from "../db/entities/bookingDb.entity"
import sessionService from "./session.service"
import { dateConstructor } from "../shared/date.constructor"

export default new class BookingService{
    async createBooking(sessionId:number,email:string,seatId:number[]){

        console.log({seatId,email,sessionId})

        try{
            let price = 0

            for(let i = 0; i < seatId.length;i++){
                
                const seat = await seatService.getSeatById(seatId[i])

                if(!seat.is_available || !seat) throw ApiError.BadRequest('Место не доступно')

                price += seat.price

            }

            await db.query('BEGIN')
            console.log(price)

            const booking:IBookingDb = (await db.query(queryConstructor.create('booking',['price','email','unique_code','session_id']),[price,email,1,sessionId])).rows[0] 

            for(let i = 0; i <= seatId.length; i++){
                await seatService.updateSeat(seatId[i],booking.id)
            }

            await db.query('COMMIT')

            const seats:ISeatDb[] = (await db.query(queryConstructor.getByParams('seats',['booking_id']),[booking.id])).rows

            const session = await sessionService.getSessionById(booking.session_id)


        return {
            hallNumber:session.hall_number,
            time:dateConstructor.getDateAndTime(session.date).time,
            seats:seats.map(seat=>({
                seatNumber:seat.seat_number,
                rowNumber:seat.row_number
            })),
            price    
        }

        }catch(e){
            await db.query('ROLLBACK')
            throw e
        }
        
    }

    async getBookingById(bookingId:number){
        const booking:IBookingDb = (await db.query(queryConstructor.getByParams('booking',['id']),[bookingId])).rows[0]

        if(!booking) throw ApiError.BadRequest('A Booking not found')
    
        const session = await sessionService.getSessionById(booking.id)

        const seats = (await db.query(queryConstructor.getByParams('seats',['booking_id']),[booking.id])).rows

        if(!seats.length) throw ApiError.BadRequest('A Booking not found')

        
    }
}