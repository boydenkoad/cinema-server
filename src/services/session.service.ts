import {pool as db} from '../db/db'
import { PriceDto } from '../dto/price.dto';
import { IHall} from '../entities/hall.model';
import { ISession } from '../entities/session.model';
import ApiError from '../exceptions/api-error';
import { queryConstructor } from '../shared/query.constructor';
import hallService from './hall.service';
import seatService from './seat.service'



export default new class SessionService{
    async create(movieId:number,hallNumber:number,date:string,time:{hours:number,minutes:number},prices:PriceDto){

        const hall:IHall = await hallService.getHall(hallNumber)

        if(!hall) throw ApiError.BadRequest('Зал не найден')
        

        try{
            await db.query('BEGIN');
    
            const session:ISession = (await db.query(queryConstructor.create('sessions', ['hall_number', 'movie_id', 'date']), [hallNumber, movieId, `${date} ${time.hours}:${time.minutes}`])).rows[0]
            
            console.log(session)

            const seat = await seatService.createSeat(session.id,hall,prices)
    
            await db.query('COMMIT')

            return seat
        }catch(e){
            console.log(e)
            db.query('COMMIT')
            throw e
        }
   
    }

    async getAll(){
        
        const sessions = (await db.query(queryConstructor.getAll('sessions'))).rows[0]

        return sessions

    }
}