import express,{Response,Request,NextFunction}  from 'express' 
import env from 'dotenv'
import movieRouter from './routes/movie.router'
import fileUpload from 'express-fileupload'
import userRouter from './routes/user.router'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middlewares/error.middleware'
import admin from './routes/admin/admin.router' 

env.config()

const PORT = process.env.PORT || 3400

const app = express()



app.use(fileUpload())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('files'))
app.use('/movies',movieRouter)
app.use('/users',userRouter)

app.use('/admin',
// authMiddleware,
admin)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
})