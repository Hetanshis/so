import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import session from "express-session"
import path from "path";
import mainRouter from "./routes/mainRoutes";
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

dotenv.config()
const app = express()

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret:`${process.env.SECRET_KEY}`,
    resave: true,
    saveUninitialized: true,

}))

const jwtOptions= {
    secretOrKey: `${process.env.SECRET_KEY}`,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()

}

app.use("", mainRouter);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})