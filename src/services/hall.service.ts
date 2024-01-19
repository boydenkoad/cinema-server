import fs from 'fs'
import path from 'path'
import ApiError from '../exceptions/api-error'
import { IHall } from '../entities/hall.model'

const hallPath = (number:string|number)=>(path.join(__dirname,'..','files','halls',`hall-${number}.json`))

export default new class HallService{
    async getHall(hallNumber:number):Promise<IHall>{
        const hall:IHall = JSON.parse(fs.readFileSync(hallPath(hallNumber),'utf-8'))
        return hall
    }

    async updateHall(hallNumber:number,data:any){
        
        const hall = fs.readFileSync(hallPath(hallNumber),'utf-8')

        if(!hall.length) throw ApiError.BadRequest('Зал не найден')

        const dataPars = JSON.stringify(data)

        fs.writeFileSync(hallPath(hallNumber),dataPars,'utf-8')

        const updatedHall = fs.readFileSync(hallPath(hallNumber),'utf-8')

        return updatedHall
    }
}

