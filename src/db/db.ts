import {Pool} from 'pg'
// import env from 'dotenv'

// env.config()


export const pool = new Pool({
    host:process.env.SERVER_IP,
    port:Number(process.env.DATABASE_PORT),
    database:process.env.DATABASE_NAME,
    password:process.env.DATABASE_PASSWORD,
    user:process.env.DATABASE_USER,
    // connectionTimeoutMillis:30000
})

// export default pool




