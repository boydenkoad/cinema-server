import jwt from 'jsonwebtoken'
import {pool as db} from '../db/db'
import {queryConstructor} from '../shared/query.constructor'
import ApiError from '../exceptions/api-error'

const accessKey = process.env.JWT_ACCESS_TOKEN || '123'
const refreshKey = process.env.JWT_REFRESH_TOKEN || '321'

export default new class TokenService{
    
    generateToken(payload:any){

        const accessToken = jwt.sign(payload,accessKey,{expiresIn:'30m'})
        const refreshToken = jwt.sign(payload,refreshKey,{expiresIn:'5d'})

        return {accessToken,refreshToken}
    }

    async findToken(refreshToken:string){

        const tokenData = (await db.query(queryConstructor.getOne('tokens',['refresh_token']),[refreshToken])).rows[0]

        return tokenData

    }

    async saveToken(userId:number,refreshToken:string){

        const dataToken = (await db.query(queryConstructor.getOne('tokens',['user_id']),[userId])).rows[0]
     

        if(dataToken){
            const data = (await db.query(queryConstructor.update('tokens','id',['refresh_token']),[refreshToken,dataToken.id])).rows[0]
            
            return data
        }

        const token = (await db.query(queryConstructor.create('tokens',['user_id','refresh_token']),[userId,refreshToken])).rows[0]

        return token

    }

    validateAccessToken(accessToken:string){
        try{
            const token = jwt.verify(accessToken,accessKey)
            return token
        }catch(e){
            return null
        }
    }

    validateRefreshToken(refreshToken:string){
        try{
            const token = jwt.verify(refreshToken,refreshKey)
            return token
        }catch(e){
            return null
        }

    }

    async removeToken(refreshToken:string){
        try{
            const token = (await db.query(queryConstructor.remove('tokens',['refresh_token']),[refreshToken])).rows[0]
            
            return token

        }catch(e){
            return null
        }
    }
    

}