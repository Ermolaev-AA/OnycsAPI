// GUITE for https://www.youtube.com/watch?v=tKM44vPHU0U&ab_channel=UlbiTV

import * as dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routers/router.js'

dotenv.config()
const PORT = process.env.PORT || 3000
const DB_URL = process.env.MONGO_URI

const app = express()

app.use(cors({
    origin: '*', // Разрешает доступ с любого домена
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}))

app.use(express.json())
app.use('/', router)

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`✅ SERVER START: http://localhost:${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

startApp()