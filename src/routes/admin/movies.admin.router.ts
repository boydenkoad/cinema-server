import { Router } from 'express'
import movieController from '../../controllers/movie.controller'
import { body } from 'express-validator'
import multer from 'multer'
import {config} from '../../../config'
import path from 'path'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        // console.log(file)
        cb(null,config.images)
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + '_' + uniqueSuffix)
    }
})



const router = Router()

router.get('/',movieController.getAll)

router.post('/',body('name').isLength({min:1}),movieController.create)

router.delete('/:id',movieController.deleteMovie)

router.get('/:id',movieController.getById)

router.patch('/:id',movieController.update)

router.post('/:id/poster',movieController.addPoster)

router.post('/:id/genres',movieController.addGenre)

router.put('/:id/genres',movieController.deleteGenre)


export default router