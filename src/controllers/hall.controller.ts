import {Request,Response,NextFunction} from 'express'
import fs,{copyFile} from 'fs'
import path, { join } from 'path'
import fileService from '../services/hall.service'
import hallService from '../services/hall.service'


export default new class HallController{
    async uploadFile(req:Request,res:Response){

        if(!req.files) return res.status(500).json({
            message:'upload error'
        })

        const file:any = req.files.file

        const filePath = path.join(__dirname,'..','..','public','uploads',`${file.name}`)

        // console.log(file)

        fs.writeFile(path.join(filePath),file.data,(req)=>{
            // console.log(req)
        })

        return res.send(filePath)
    }
    
    async createFile(req:Request,res:Response){
        fs.mkdirSync(path.join(__dirname,'..','..','public','files',`${req.body.name}`))
        return res.json({message:'File created'})
    }
    
    async getFile(req:Request,res:Response){
        const {number} = req.params
        
        const hall = await fileService.getHall(Number(number))

        return res.json(hall)
    }

    async updateHall(req:Request,res:Response,next:NextFunction){
        
        try{
            const hall = await hallService.updateHall(Number(req.params.number),req.body)

            return res.json(JSON.parse(hall))

        }catch(e){
            next(e)
        }

    }
}

