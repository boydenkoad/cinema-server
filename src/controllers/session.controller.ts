import {Request,Response,NextFunction} from 'express'
import sessionService from '../services/session.service'
import movieService from '../services/movie.service'
import { ISession } from '../entities/session.model'
import seatService from '../services/seat.service'
import hallService from '../services/hall.service'
import { ISeat } from '../entities/hall.model'
import { dateConstructor } from '../shared/date.constructor'
import { ISessionDb } from '../db/entities/sessionDb.entity'
import { IMovieDb } from '../db/entities/movieDb.enitny'
import { IGenre } from '../entities/genre.model'
import { ISessionDbMinPrice } from '../dto/session.dto'


 async function sortByMovie(sessions:ISessionDbMinPrice[],movies:IMovieDb[]){

            const result:any[] = [] 

            for(let movie of movies){

                const genres = await movieService.getGenres(movie.id)

                const sessionsFilter= sessions.filter(session=>session.movie_id === movie.id)

                if(!sessionsFilter.length) continue

                const movieSession = {
                    movieName:movie.name,
                    poster:movie.poster,
                    genres:genres.map(genre=>genre.name),
                    slug:movie.slug,
                    sessions:sessionsFilter.map<ISession>(session=>({
                        id:session.id,
                        minPrice:session.minPrice,
                        hallNumber:session.hall_number,
                        sessionTime:dateConstructor.getDateAndTime(session.date).time
                    }))
                }

                result.push(movieSession)

            } 

            return result
    }


export default new class SessionController{
    
    async createSession(req:Request,res:Response,next:NextFunction){
        try{
            const body = req.body

            const session = await sessionService.create(body)
    
            return res.json(session)
        }catch(e){
            next(e)
        }    
    }

    async getAll(req:Request,res:Response,next:NextFunction){
        try{

            const {date} = req.query

            const sessions = await sessionService.getAll()

            const movies = await movieService.getAll()

            const dateNow = Intl.DateTimeFormat('ru').format(Date.now())

            if(!date){

                const sessionsByDate = sessions.filter(session=> Intl.DateTimeFormat('ru').format(session.date) === dateNow)

                console.log(sessionsByDate)

                const formatSessions = await sortByMovie(sessionsByDate,movies)

                return res.json(formatSessions)
            
            }

            const sessionsByDate = sessions.filter(session=> Intl.DateTimeFormat('ru').format(session.date) === date)

            const formatSessions = await sortByMovie(sessionsByDate,movies)

            return res.json(formatSessions)

        }catch(e){
            next(e)
        }
    }

    async getSessionById(req:Request,res:Response,next:NextFunction){

        interface IRow{
            rowNumber:number,
            position:{
                x:number,
                y:number
            },
            seats:any[]
        }

        try{

            const {sessionId} = req.params

            

            const session = await sessionService.getSessionById(+sessionId)

            const seatsDb = await seatService.getSeats(session.id)
            
            const hall = await hallService.getHallByNumber(session.hall_number)

            const rows:any[] = []

            for(let row of hall.rows){
                
                const rowRes:IRow = {
                    rowNumber:row.rowNumber,
                    position:row.position,
                    seats:[]
                }

                for(let seat of row.seats){
                    const res = {
                        id:seatsDb.filter(el=>el.seat_number === seat.seatNumber && el.row_number === row.rowNumber)[0].id,
                        seatNumber:seat.seatNumber,
                        seatType:seat.type,
                        isAvailable:seatsDb.filter(el=>el.seat_number === seat.seatNumber && el.row_number === row.rowNumber)[0].is_available,
                        price:seatsDb.filter(el=>el.seat_number === seat.seatNumber && el.row_number === row.rowNumber)[0].price,
                        position:seat.position,
                    }
                    rowRes.seats.push(res)
                }
                
                rows.push(rowRes)
            }

            const {date,time,longDateFormat} = dateConstructor.getDateAndTime(session.date)

            return res.json({
                session:{
                    sessionId:session.id,
                    date:longDateFormat,
                    time:time
                },
                hallScheme:{
                    hallNumber:hall.hallNumber,
                    screen:hall.screen,
                    rows:rows
                }
                
            })

        }catch(e){
            next(e)
        }
    }

}