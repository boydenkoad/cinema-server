import {Pool} from 'pg'
import env from 'dotenv'

env.config()


export const pool = new Pool({
    host:process.env.SERVER_IP,
    port:5432,
    database:'cinema',
    password:'admin',
    user:'postgres',
    connectionTimeoutMillis:30000
})

// export default pool




