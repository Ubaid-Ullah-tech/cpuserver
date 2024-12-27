import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import AuthRoutes from './routes/AuthRoutes.js';
import dotenv from 'dotenv';
import db from './config/db.js';

dotenv.config();

db();

const app = express();
const PORT = process.env.PORT || 5000;


// app.use(cors())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());

//routes
app.use('/api/v2/auth',AuthRoutes)

// web page 
app.get('/' ,(req,res)=>{
    res.send('welcome to the browser')
})

app.listen(PORT,()=>{
    console.log(`your server is Running on http://localhost:${PORT}`)
})