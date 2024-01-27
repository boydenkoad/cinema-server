import {pool as db} from '../db/db'
import { IMovieDb } from '../db/entities/movieDb.enitny';
import { ISessionDb } from '../db/entities/sessionDb.entity';
import { PriceDto } from '../dto/price.dto';
import { IHall} from '../entities/hall.model';
import { IMovie } from '../entities/movie.model';
import { ISession } from '../entities/session.model';
import ApiError from '../exceptions/api-error';
import { queryConstructor } from '../shared/query.constructor';
import hallService from './hall.service';
import movieService from './movie.service';
import seatService from './seat.service'



export default new class SessionService{
    async create(movieId:number,hallNumber:number,date:string,time:{hours:number,minutes:number},prices:PriceDto){

        const hall:IHall = await hallService.getHallByNumber(hallNumber)

        try{
            await db.query('BEGIN');
    
            const session:ISession = (await db.query(queryConstructor.create('sessions', ['hall_number', 'movie_id', 'date']), 
            [hallNumber, movieId, `${date} ${time.hours}:${time.minutes}`])).rows[0]
            
            if(!session) throw ApiError.BadRequest('Ошибка базы данных')

            const seats:any[] = [] 

            for (let i = 0; i < hall.rows.length; i++) {
                for (let j = 0; j < hall.rows[i].seats.length; j++) {

                    const seat = await seatService.createSeat(session.id,hall.hallNumber,hall.rows[i].rowNumber,hall.rows[i].seats[j],prices)

                    seats.push(seat)
                }
            }

            await db.query('COMMIT')
            
            return seats

        }catch(e){
            await db.query('ROLLBACK')
            throw e
        }   
    }
    
    async getAll(){
        
        const sessions = (await db.query(queryConstructor.getAll('sessions'))).rows[0]

        return sessions

    }

    async getSessionById(id:number){
        const session:ISessionDb = (await db.query(queryConstructor.getByParams('sessions',['id']),[id])).rows[0]

        if(!session) throw ApiError.BadRequest('Сеанс не найден')

        return session

    }

    async getSessionsByDate(date:string){

        const sessions:ISessionDb[] = (await db.query('SELECT id,hall_number,movie_id, EXTRACT(HOUR FROM date) as hours,EXTRACT(MINUTE FROM date) as minutes FROM sessions  WHERE date::date = $1 ORDER BY date ASC ',[date])).rows

        if(!sessions.length) throw ApiError.BadRequest('Сеансов не найдено')

        return sessions
    }

    async getSessionsByDateAndMovieSlug(date:string,slug:string){

        const movie = await movieService.getOneBySlug(slug)

        const sessions:ISessionDb[] = (await db.query('SELECT id,hall_number,movie_id, EXTRACT(HOUR FROM date) as hours,EXTRACT(MINUTE FROM date) as minutes FROM sessions  WHERE date::date = $1 AND movie_id = $2 ORDER BY date ASC ',[date,movie.id])).rows

        if(!sessions.length) throw ApiError.BadRequest('Сеансов не найдено')

        return sessions   
    }
}