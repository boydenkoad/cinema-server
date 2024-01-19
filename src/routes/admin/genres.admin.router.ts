import { Router } from 'express'
import { body } from 'express-validator'
import genreController from '../../controllers/genre.controller'

const router = Router()

router.get('/',genreController.getAll)

router.get('/:id',genreController.getOne)

router.get('/movie/:id',genreController.getMovieGenres)

router.post('/',body('name').isLength({min:1}),genreController.create)

router.patch('/:id',body('name').isLength({min:1}),genreController.updateGenre)

router.delete('/:id',genreController.removeGenre)

export default router