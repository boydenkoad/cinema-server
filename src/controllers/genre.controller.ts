import {Request,Response,NextFunction} from 'express'
import genreService from '../services/genre.service'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error'


export default new class GenreController{

    async getAll(req:Request,res:Response,next:NextFunction){

        try{
            const genres = await genreService.getAll()
            return res.json(genres)
        }catch(e){
            next(e)
        }
       
        
    }

    async getOne(req:Request,res:Response,next:NextFunction){

        try{
            const genres = await genreService.getOne(Number(req.params.id))

            return res.json(genres)

        }catch(e){
            next(e)
        }

    }

    async getMovieGenres(req:Request,res:Response,next:NextFunction){
        try{

            const genres = await genreService.getOne(Number(req.params.id))

            return res.json(genres)

        }catch(e){
            next(e)
        }
    }


    
    async create(req:Request,res:Response,next:NextFunction){

        try{

            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const {name} = req.body

            const genre = await genreService.create(name)

            return res.json(genre)

        }catch(e){
            next(e)
        }
       
        
    }

    async updateGenre(req:Request,res:Response,next:NextFunction){

        try{

            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
            }

            const {name} = req.body
            const {id} = req.params

            const genre = await genreService.update(Number(id),name)

            return res.json(genre)

        }catch(e){
            next(e)
        }

    }

    async removeGenre(req:Request,res:Response,next:NextFunction){

        try{
            const {id} = req.params

            const genre = await genreService.remove(Number(id))

            return res.json(genre)

        }catch(e){
            next(e)
        } 
    }
    
    

}