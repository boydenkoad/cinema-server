import {pool as db} from '../db/db'
import ApiError from '../exceptions/api-error'
import { queryConstructor } from '../shared/query.constructor'

export default new class Genre{

    async getAll(){

        try{
            const genres = (await db.query("SELECT * FROM genres")).rows

            return genres

        }catch(e){

            throw e

        }
     
    }

    async getOne(id:number){
        const genre = (await db.query(queryConstructor.getByParams('genres',['id']),[id])).rows[0]
    
        return genre
    }
    
    async create(genreName:string){

        const isExist = (await db.query(queryConstructor.getByParams('genres',['name']),[genreName])).rows[0]

        if(isExist) throw ApiError.BadRequest('Жанр уже существует')

        const genre = (await db.query(queryConstructor.create('genres',['name']),[genreName])).rows[0]
        
        if(!genre) throw ApiError.BadRequest('Неизвестная ошибка') 

        return genre

    }

    async update(id:number,name:string){
        try{
            
            const genre = (await db.query(queryConstructor.update('genres','id',['name']),[name,id])).rows[0]
            
            return genre

        }catch(e){
            
            throw ApiError.BadRequest('Неизвестная ошибка')
        
        }
    }

    async remove(id:number){
        try{
            const genre = (await db.query(queryConstructor.remove('genres',['id']),[id])).rows[0]
            return genre
        }catch(e){
            throw ApiError.BadRequest('Неизвестная ошибка')
        }
    }


}