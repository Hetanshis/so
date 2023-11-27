import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import session from "express-session"
import path from "path";
import mainRouter from "./routes/mainRoutes";
import passport from "passport";
import prisma from "./config/prisma";
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

passport.use(new JwtStrategy(jwtOptions, async(payload:any, done:any) => {
    const user:any = await prisma.user.findFirst(payload.id);
    console.log(user, "user1")
    if(!user){
        return done(null, false)
    }

    // return with Json file
    done(null, user.toJSON());
}))

passport.serializeUser((user: any, done) => {
    console.log(user, "user2")
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: any, done) => {
    try {
      const user = await prisma.user.findFirst({where:{id}});
      console.log(user, "user3")
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

app.use("", mainRouter);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})