import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import main_Routes from "./routes/mainRoutes";
dotenv.config()
const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", main_Routes);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})