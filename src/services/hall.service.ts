import fs from 'fs'
import path from 'path'
import ApiError from '../exceptions/api-error'
import { IHall } from '../entities/hall.model'

const hallPath = (number:string|number)=>path.join(__dirname,'..','files','halls',`hall-${number}.json`)

export default new class HallService{
    
    createHall(hallNumber:number){

        const exist = fs.existsSync(hallPath(hallNumber))

        if(exist){
            throw ApiError.BadRequest(`Зал с номером ${hallNumber} существует.`)
        }

        fs.writeFileSync(hallPath(hallNumber),`{"hallNumber":${hallNumber}}`)

        return hallNumber
        
    }

    async getHallByNumber(hallNumber:number):Promise<IHall>{
        try {
            const hall:IHall = JSON.parse(fs.readFileSync(hallPath(hallNumber),'utf-8'))
            return hall
        } catch (e) {
            throw ApiError.BadRequest('Зал не найден.')
        }
    }

    async deleteHall(hallNumber:number){
        try{
            
            fs.rmSync(hallPath(hallNumber))
            
            return `Зал ${hallNumber} удален.`
            
        }catch(e){
            throw ApiError.BadRequest(`Зал с номером ${hallNumber} существует.`)
        }
        
    }

    async updateHall(hallNumber:number,data:any){

        const hall = fs.existsSync(hallPath(hallNumber))

        if(!hall) throw ApiError.BadRequest(`Зал №${hallNumber} нe найден`)

        const dataPars = JSON.stringify(data)

        fs.writeFileSync(hallPath(hallNumber),dataPars,'utf-8')

        const updatedHall = fs.readFileSync(hallPath(hallNumber),'utf-8')

        return updatedHall
        
    }
}

