import fs from 'fs'
import {  UpdateMovieDto } from "../dto/movie.dto"
import { IMovie } from "../entities/movie.model"
import {pool as db} from '../db/db'
import { queryConstructor } from "../shared/query.constructor"
import ApiError from "../exceptions/api-error"
import { IGenre } from "../entities/genre.model"
import path from 'path'
import {config} from '../../config'
import fileService from './file.service'

export default new class MovieService{

    async getAll(){
        const movies = (await db.query(queryConstructor.getAll('movies'))).rows
        return movies
    }

    async getOneById(id:number){

        const movie = (await db.query(queryConstructor.getOne('movies',['id']),[id])).rows[0]
    
        if(!movie) throw ApiError.BadRequest('Фильм не найден')

        return movie

    }

    async getOneBySlug(slug:string){

        const movie = (await db.query(queryConstructor.getOne('movies',['slug']),[slug])).rows[0]
    
        if(!movie) throw ApiError.BadRequest('Фильм не найден')

        return movie

    }

    async create(movieName:string){

        const movie = (await db.query(queryConstructor.create('movies',['name']),[movieName])).rows[0]

        return movie
    }

    async update(movieDto:UpdateMovieDto,id:number){
        // try{
            const movieDb:IMovie = (await db.query(queryConstructor.getOne('movies',['id']),[id])).rows[0]
        
            if(!movieDb) throw ApiError.BadRequest('Фильм не найден')
    
            movieDb.name = movieDto.name || movieDb.name
            movieDb.actors = movieDto.actors || movieDb.actors
            movieDb.country = movieDto.country || movieDb.country
            movieDb.description = movieDto.description || movieDb.description
            movieDb.genres = movieDto.genres || movieDb.genres
            movieDb.poster = movieDto.poster || movieDb.poster
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
        // }catch(e){
            // throw e
        // }
       
    } 

    async addGenre(movieId:number,genreId:number){

        const dataDb = (await db.query(queryConstructor.getOne('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows

        if(dataDb.length) throw ApiError.BadRequest('Жанр уже добавлен')

        const relation = (await db.query(queryConstructor.create('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows[0]

        return relation
    }

    async addPoster(movieId:number,file:any){

        const movieDb = (await db.query(queryConstructor.getOne('movies',['id']),[movieId])).rows[0]

        if(!movieDb) throw ApiError.BadRequest('Фильм не найден')

        if(!file['file']) throw ApiError.BadRequest('Ошибка файла')

        const fileObject = file['file']


        // fileObject.name = Date.now()

        const pathDir = path.join(config.images,`${fileObject.name}`)

        const posterUrl = path.join(config.baseUrl,'public','images','poster',`${fileObject.name}`)


        fs.writeFileSync(pathDir,fileObject.data)

        const movie = (await db.query(queryConstructor.update('movies','id',['poster']),[posterUrl,movieId])).rows[0]
        
        return movie
    }

    async removeGenre(movieId:number,genreId:number){

        const genre = (await db.query(queryConstructor.remove('movies_genres',['movie_id','genre_id']),[movieId,genreId])).rows
        
        return genre
    }

    async getGenres(movieId:number){

        const genres:IGenre[] = (await db.query('SELECT DISTINCT g.id, g.name FROM movies_genres as mg INNER JOIN movies as m ON m.id = $1 INNER JOIN genres as g ON genre_id = g.id',[movieId])).rows

        return genres
    }
}