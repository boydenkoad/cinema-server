import { IMovie } from "../entities/movie.model";

export type CreateMovieDto = Pick<IMovie,'name'|'slug'>

export type UpdateMovieDto = IMovie