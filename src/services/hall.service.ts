import fs from 'fs'
import path from 'path'
import ApiError from '../exceptions/api-error'
import { IHall } from '../entities/hall.model'

const hallPath = (number:string|number)=>path.join(__dirname,'..','files','halls',`hall-${number}.json`)
const hallsDir = path.join(__dirname,'..','files','halls')

export default new class HallService{
    
    createHall(hallNumber:number){

        const exist = fs.existsSync(hallPath(hallNumber))

        if(exist){
            throw ApiError.BadRequest(`Зал с номером ${hallNumber} существует.`)
        }

        fs.writeFileSync(hallPath(hallNumber),`{
            "hallNumber":${hallNumber},
            "screen":{
                "position": {
                    "x": 0,
                    "y": 0
                },
                "size": {
                    "width": 0,
                    "height": 0
                }
            },
            "rows":[]
        }`)

        return hallNumber
        
    }

    async getAll(){
        try{
            const result:any[] = []

            const halls = fs.readdirSync(hallsDir)

            if(halls.length){
                for(let i = 0; i < halls.length; i++){
                    const hall:IHall = JSON.parse(fs.readFileSync(path.join(hallsDir,halls[i]),'utf-8'))

                    const {hallNumber} = hall

                    result.push({hallNumber})
                }
            }

            return result

        }catch(e){
            throw ApiError.BadRequest('Что то пошло не так')
        }
       
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

    async updateHall(hallNumber:number,data:IHall){


        const hall = fs.existsSync(hallPath(hallNumber))

        const {rows,screen} = data

        const newHall = {
            hallNumber:hallNumber,
            screen:screen|| ` "position": {
                "x": 0,
                "y": 0
            },
            "size": {
                "width": 0,
                "height": 0
            }`,
            rows
        }

        if(!hall) throw ApiError.BadRequest(`Зал №${hallNumber} нe найден`)

        const dataPars = JSON.stringify(newHall)

        fs.writeFileSync(hallPath(hallNumber),dataPars,'utf-8')

        const updatedHall = fs.readFileSync(hallPath(hallNumber),'utf-8')

        return updatedHall
        
    }
}

