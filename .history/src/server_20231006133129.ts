import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import mainRouter from "./routes/mainRoutes";
dotenv.config()
const app = express()

app.use(express.json());
app.use(bodyParser.json({}));

app.use("", mainRouter);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})