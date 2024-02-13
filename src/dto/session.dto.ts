import { ISessionDb } from "../db/entities/sessionDb.entity"
import { PriceDto } from "./price.dto"

export interface CreateSessionDto{
    movieId:number,
    hallNumber:number,
    date:{
        day:number,
        month:number,
        year:number
    }

    time:{
        hours:number,
        minutes:number
    }
    
    prices:PriceDto
}

export interface ISessionDbMinPrice extends ISessionDb{
    minPrice:number
}