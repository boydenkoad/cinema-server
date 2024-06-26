import { Request, Response, NextFunction } from "express";
import movieService from "../services/movie.service";
import { IMovie } from "../entities/movie.model";
import {validationResult} from 'express-validator'
import ApiError from "../exceptions/api-error";
import genreService from "../services/genre.service";
import { dateConstructor } from "../shared/date.constructor";
import { IMovieDb } from "../db/entities/movieDb.enitny";
import { IGenre } from "../entities/genre.model";
import { IMovieResult } from "../dto/movie.dto";
import { config } from "../../config";


export default new class MovieController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try{
  
      const result:any = []

      const movies = await movieService.getAll();

      for(let movie of movies){

        const genres = await movieService.getGenres(movie.id)
      
        const {poster,...movieResult} = movie

        await result.push({
          ...movieResult,
          poster:`${config.baseDNS}/static/${poster}`,
          genres})
      }

      return res.json(result);
    }catch(e){
      next(e)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const movie = await movieService.getOneById(Number(id));

      const genres = await movieService.getGenres(movie.id)

      const {
        poster,...result
      } = movie

      return res.json({
        ...result,
        poster:`${config.baseDNS}/static/${poster}`,
        genres
      });

    } catch (e) {
      next(e)
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params

    try {
      const movie = await movieService.getOneBySlug(slug);

      const genres = await movieService.getGenres(movie.id)

      return res.json({...movie,genres});

    } catch (e) {
      next(e)
    }
  }

  async getMovieSessions(req: Request, res: Response, next: NextFunction){

    try{

      const {slug} = req.params
      
      const {date} = req.query as {date:string}

      const sessions = await movieService.getMovieSession(slug)

       const currentDate = Intl.DateTimeFormat('ru').format(Date.now())

      if(!date){

        const sessionsFiltered = sessions.filter(sessions=>Intl.DateTimeFormat('ru').format(sessions.date) === currentDate)
        
        const result = sessionsFiltered.map(session=>({
          id:session.id,
          hallNumber:session.hall_number,
          time:dateConstructor.getDateAndTime(session.date).time
        }))

        return res.json(result)

      }

      const sessionsFiltered = sessions.filter(sessions=>Intl.DateTimeFormat('ru').format(sessions.date) === date)
    
      const result = sessionsFiltered.map(session=>({
        id:session.id,
        hallNumber:session.hall_number,
        time:dateConstructor.getDateAndTime(session.date).time
      }))

      return res.json(result)

    }catch(e){
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

  async deleteMovie(req: Request, res: Response, next: NextFunction){
    
    const id = +req.params.id

    try{

      if(!id){
        next(ApiError.BadRequest(`Невырный id: ${id}`))
      }

      const movie = await movieService.deleteMovie(id)

      return res.status(200).json(movie)
    }catch(e){
       next(e)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const movie: IMovie = req.body;

    try {
      const newMovie = await movieService.update(movie, Number(id));

      const genres = await movieService.getGenres(movie.id)

      return res.json({...newMovie,genres});
    } catch (e) {
      next(e)
    }
  }

  async addPoster(req: Request, res: Response, next: NextFunction){ 

    try{
      const {id} = req.params
      
      const file:any = req.files
  
      if(!file) next(ApiError.BadRequest('Ошибка файла контроллер'))
    
      const movie = await movieService.addPoster(Number(id),file)

      const {poster} = movie

      return res.send(`${config.baseDNS}/static/${poster}`)

    }catch(e){

      next(e)

    }
  }

  async addGenre(req: Request, res: Response, next: NextFunction){

    try{

      for(let genreId of req.body.genresId){

        const genreDb = await genreService.getOne(genreId)

        if(!genreDb) return next(ApiError.BadRequest(`Жанра с id ${genreId} не существует`))
      }


      for(let genreId of req.body.genresId){
        await movieService.addGenre(Number(req.params.id),genreId)
      }
      
      const genres = await movieService.getGenres(Number(req.params.id))

      return res.json(genres)

    }catch(e){

      next(e)

    }
  }

  async deleteGenre(req: Request, res: Response, next: NextFunction){

    try{

      const genresId = req.body.genresId

      for(let genreId of genresId){

        const genreDb = await genreService.getOne(genreId)

        if(!genreDb) return next(ApiError.BadRequest('Жанр не существует'))

      }

      for(let genreId of genresId){
        await movieService.removeGenre(Number(req.params.id),genreId)
      }
     
      const genres = await movieService.getGenres(Number(req.params.id))

      return res.json(genres)

    }catch(e){
      next(e)
    }
  }
};
