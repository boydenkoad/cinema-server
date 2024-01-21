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

        const hall:IHall = await hallService.getHallByNumber(hallNumber)

        try{
            await db.query('BEGIN');
    
            const session:ISession = await (await db.query(queryConstructor.create('sessions', ['hall_number', 'movie_id', 'date']), [hallNumber, movieId, `${date} ${time.hours}:${time.minutes}`])).rows[0]
            
            if(!session) throw ApiError.BadRequest('Ошибка базы данных')

            const seats = await seatService.createSeat(session.id,hall,prices)
            
            await db.query('COMMIT')
            
            return seats
        }catch(e){
            db.query('COMMIT')
            throw e
        }   
    }

    async getAll(){
        
        const sessions = (await db.query(queryConstructor.getAll('sessions'))).rows[0]

        return sessions

    }
}