import {IGenre} from './genre.model'

export type IMovie = {
    id:number,
    name:string
    description:string
    producer:string
    actors:string
    country:string
    poster:string
    duration:number
    slug:string
    rating:number
    trailer:string
    genres:IGenre[]
}