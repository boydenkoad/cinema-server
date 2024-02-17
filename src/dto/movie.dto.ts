import { IGenre } from "../entities/genre.model";
import { IMovie } from "../entities/movie.model";

export type CreateMovieDto = Pick<IMovie,'name'|'slug'>

export type UpdateMovieDto = IMovie

export interface IMovieResult extends IMovie{
    genres:IGenre[]
}