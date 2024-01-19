import { Request, Response, NextFunction } from "express";
import movieService from "../services/movie.service";
import { IMovie } from "../entities/movie.model";
import {validationResult} from 'express-validator'
import ApiError from "../exceptions/api-error";
import genreService from "../services/genre.service";


export default new class MovieController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const movies = await movieService.getAll();

    return res.json(movies);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const movie = await movieService.getOneById(Number(id));

      const genres = await movieService.getGenres(movie.id)

      return res.json({...movie,genres});

    } catch (e) {
      next(e)
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;

    try {
      const movie = await movieService.getOneBySlug(slug);

      const genres = await movieService.getGenres(movie.id)

      return res.json({...movie,genres});

    } catch (e) {
      next(e)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

        const errors = validationResult(req)

        if(!errors.isEmpty()){
          return next(ApiError.BadRequest('Ошибка при валидации',errors.array()))
        }

      const { name } = req.body;

      if (!name.length) {
        return res.status(500).send("Некорректные данные");
      }

      const movie = await movieService.create(name);

      return res.status(200).json(movie);

    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const movie: IMovie = req.body;

    try {
      const newMovie = await movieService.update(movie, Number(id));

      return res.json(newMovie);
    } catch (e) {
      next(e)
    }
  }

  async addPoster(req: Request, res: Response, next: NextFunction){ 

    try{
      const {id} = req.params

      const file:any = req.files
  
      if(!file) next(ApiError.BadRequest('Ошибка файла контроллер'))
    
      const poster = await movieService.addPoster(Number(id),file)

      return res.send(poster)

    }catch(e){

      next(e)

    }
   
  }

  async addGenre(req: Request, res: Response, next: NextFunction){
    try{

      const genreDb = await genreService.getOne(req.body.id)

      if(!genreDb) return next(ApiError.BadRequest('Жанр не существует'))

      await movieService.addGenre(Number(req.params.id),req.body.id)
      
      const genres = await movieService.getGenres(Number(req.params.id))

      return res.json(genres)

    }catch(e){

      next(e)

    }
  }

  async deleteGenre(req: Request, res: Response, next: NextFunction){
    try{

      const genreDb = await genreService.getOne(req.body.id)

      if(!genreDb) return next(ApiError.BadRequest('Жанр не существует'))

      await movieService.removeGenre(Number(req.params.id),req.body.id)

      const genres = await movieService.getGenres(Number(req.params.id))

      return res.json(genres)

    }catch(e){
      next(e)
    }
  }
};
