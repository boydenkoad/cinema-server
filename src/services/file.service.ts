import fs from 'fs'
import ApiError from '../exceptions/api-error'


export default new class FileService{

    createFile(path:string,file:any,fileName:string){

        if(!file) throw ApiError.BadRequest('Ошибка файла')

        file.name = Date.now() + fileName

        fs.writeFile(path,file.data,(err)=>{

        })
    
        return path
    }

    deleteFile(path:string){
        fs.unlink(path,(err)=>{
            // console.log(err)
        })
    }

}