import { UserDto } from "../dto/user.dto"
import tokenService from "./token.service"
import bcrypt from 'bcrypt'
import ApiError from "../exceptions/api-error"
import {queryConstructor} from '../shared/query.constructor'
import {pool as db} from '../db/db'
import { IUser } from "../entities/user.model"

const salt = 6


export default new class UserService{
    
    async getAll(){
        try{
            const users = (await db.query(queryConstructor.getAll('users',['id','login','is_activated']))).rows
            return users

        }catch(e){
            throw ApiError.BadRequest('Некорректный запрос')
        }
        
    }
    
    async getOne(id:number){

 
            const user = (await db.query(queryConstructor.getOne('users',['id'],['id','login','is_activated']),[id])).rows[0]

            if(!user) throw ApiError.BadRequest('Пользователь не найден')

            return user
   
    }

    async create(login:string,pass:string){
        
        const user = (await db.query(queryConstructor.getOne('users',['login'],['login']),[login])).rows[0]

        if(user) throw ApiError.BadRequest('Логин не доступен') 

        const hashPassword = await bcrypt.hash(pass,salt)

        const newUser = (await db.query(queryConstructor.create('users',['login','password'],true,['login']),[login,hashPassword])).rows[0]

        const {password,...res} = newUser

        return res
    }

    async activateUser(id:number){
        
        try{
            const user = (await db.query(queryConstructor.update('users','id',['is_activated'],['id','login','is_activated']),[true,id])).rows[0]
            
            return user

        }catch(e){

            throw ApiError.BadRequest('Неизвестная ошибка')
        }


    }

    async login(login:string,password:string){
        
        const user:IUser = await (await db.query(queryConstructor.getOne('users',['login']),[login])).rows[0]
        
        if(!user || !user.is_activated) throw ApiError.BadRequest('Неверный логин или пароль')

        const isCurrent = await bcrypt.compare(password,user.password)

        if(!isCurrent) throw ApiError.BadRequest('Неверный логин или пароль')

        const userDto = new UserDto(user)

        const token = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id,token.refreshToken)

        return {...token,user:userDto}
    }

    async logout(refreshToken:string){
        
        const token = await tokenService.removeToken(refreshToken)
        
        return token
    }

   async refreshToken(refreshToken:string){

    if(!refreshToken) throw ApiError.UnauthorizedError()

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if(!userData||!tokenFromDb) throw ApiError.UnauthorizedError()

    const user:IUser = (await db.query(queryConstructor.getOne('users',['id']),[tokenFromDb['user_id']])).rows[0]

    const userDto = new UserDto(user)

    const tokens = tokenService.generateToken({...userDto})

    await tokenService.saveToken(userDto.id,tokens.refreshToken)

    return {...tokens,user:userDto}

   }

}