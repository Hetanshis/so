import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import main_Routes from "./routes/mainRoutes";
import path from "path";
dotenv.config()
const app = express()

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", main_Routes);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})