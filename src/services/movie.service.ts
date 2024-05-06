import fs from 'fs'
import ApiError from "../exceptions/api-error"
import path from 'path'
import {  UpdateMovieDto } from "../dto/movie.dto"
import { IMovie } from "../entities/movie.model"
import {ISessionDb} from '../db/entities/sessionDb.entity'
import {pool as db} from '../db/db'
import { queryConstructor } from "../shared/query.constructor"
import { IGenre } from "../entities/genre.model"
import {config} from '../../config'
import { IMovieDb } from '../db/entities/movieDb.enitny'
import sessionService from './session.service'
import { dateConstructor } from '../shared/date.constructor'
import genreService from './genre.service'


export default new class MovieService{

    async getAll():Promise<IMovieDb[]>{
   
        const movies:IMovieDb[] = (await db.query(queryConstructor.getAll('movies'))).rows

        return movies
    }

    async getOneById(id:number):Promise<IMovieDb>{

        const movie = (await db.query(queryConstructor.getByParams('movies',['id']),[id])).rows[0]
    
        if(!movie) throw ApiError.BadRequest('Фильм не найден')

        return movie
    }

    async getOneBySlug(slug:string){

        const movie:IMovieDb = (await db.query(queryConstructor.getByParams('movies',['slug']),[slug])).rows[0]
    
        if(!movie) throw ApiError.BadRequest('Фильм не найден')

        return movie
    }

    async getMovieSession(slug:string){

        const movie = await this.getOneBySlug(slug)

        const sessions:ISessionDb[] = (await db.query('SELECT id,hall_number,movie_id,date, EXTRACT(HOUR FROM date) as hours,EXTRACT(MINUTE FROM date) as minutes FROM sessions  WHERE movie_id = $1 ORDER BY date ASC ',[movie.id])).rows

        if(!sessions.length) throw ApiError.BadRequest('Сеансов не найдено')

        return sessions   
    } 

    async create(movieName:string){

        const movie = (await db.query(queryConstructor.create('movies',['name']),[movieName])).rows[0]

        return movie
    }

    async deleteMovie(id:number){
        const movie = await this.getOneById(id)

        await db.query(queryConstructor.remove('movies_genres',['movie_id']),[id])
        
        await db.query(queryConstructor.remove('movies',['id']),[id])

        return movie
    }

    async update(movieDto:UpdateMovieDto,id:number){

        const movieDb:IMovie = (await db.query(queryConstructor.getByParams('movies',['id']),[id])).rows[0]
    
        if(!movieDb) throw ApiError.BadRequest('Фильм не найден')

        movieDb.name = movieDto.name || movieDb.name
        movieDb.actors = movieDto.actors || movieDb.actors
        movieDb.country = movieDto.country || movieDb.country
        movieDb.description = movieDto.description || movieDb.description
        movieDb.genres = movieDto.genres || movieDb.genres
        movieDb.producer = movieDto.producer || movieDb.producer
        movieDb.rating = movieDto.rating || movieDb.rating
        movieDb.slug = movieDto.slug || movieDb.slug
        movieDb.trailer = movieDto.trailer || movieDb.trailer
        movieDb.duration = movieDto.duration || movieDb.duration

        const {actors,country,description,duration,genres,name,poster,producer,rating,slug,trailer} = movieDb
        
        const updatedMovie = (await db.query(queryConstructor.update('movies','id',
        ['name','actors','country','description','poster','producer','rating','slug','trailer','duration']),
        [name,actors,country,description,poster,producer,rating,slug,trailer,duration,id])).rows[0]
                    
        return updatedMovie     
    } 

    async addGenre(movieId:number,genreId:number){

        const dataDb = (await db.query(queryConstructor.getByParams('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows

        if(dataDb.length) throw ApiError.BadRequest('Жанр уже добавлен')

        const relation = (await db.query(queryConstructor.create('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows[0]

        return relation
    }

    async addPoster(movieId:number,file:any):Promise<IMovieDb>{

        const movieDb = (await db.query(queryConstructor.getByParams('movies',['id']),[movieId])).rows[0]
        
        if(!movieDb) throw ApiError.BadRequest('Фильм не найден')

        if(!file['file']) throw ApiError.BadRequest('Ошибка файла')

        const fileObject = file['file']

        const pathDir = path.join(config.images,`${fileObject.name}`)
 
        // const  = `${}`

        fs.writeFileSync(pathDir,fileObject.data)

        const movie = (await db.query(queryConstructor.update('movies','id',['poster']),[fileObject.name,movieId])).rows[0]
        
        return movie
    }

    async removeGenre(movieId:number,genreId:number){

        const genre = (await db.query(queryConstructor.remove('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows
        
        return genre
    }

    async getGenres(movieId:number){

        const genres:IGenre[] = (await db.query('SELECT g.id, g.name FROM movies_genres as mg INNER JOIN genres as g ON genre_id = g.id WHERE mg.movie_id = $1',[movieId])).rows

        return genres
    }
}