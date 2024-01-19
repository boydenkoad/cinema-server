import {Request,Response,NextFunction} from 'express'
import fs,{copyFile} from 'fs'
import path, { join } from 'path'
import fileService from '../services/file.service'
import ApiError from '../exceptions/api-error'


export default new class FileController{
    async uploadFile(req:Request,res:Response){

        if(!req.files) return res.status(500).json({
            message:'upload error'
        })

        const file:any = req.files.file

        const filePath = path.join(__dirname,'..','..','public','images',`${file.name}`)

        console.log(file)

        fs.writeFile(path.join(filePath),file.data,(req)=>{
            console.log(req)
        })

        return res.send(filePath)
    }
    
    async createFile(req:Request,res:Response){
        fs.mkdirSync(path.join(__dirname,'..','..','public','images',`${req.body.name}`))
        return res.json({message:'File created'})
    }
    
    async getFile(req:Request,res:Response){
        const {hallName} = req.params
        
        // const hall = fileService.getHall(`hall_1.json`)

        // console.log(hallName)
        // console.log(hall)

        // return res.send(hall)
    }

    async fileServiceTest(req:Request,res:Response,next:NextFunction){
        
        const file:any = req.files

        // const filePath = path.join(__dirname,'..','..','public','uploads',`${file.name}`)

        // if(!file) return next(ApiError.BadRequest('Ошибка файла'))

        // file.poster.name = Date.now()

        return res.json(file)
    }
}


