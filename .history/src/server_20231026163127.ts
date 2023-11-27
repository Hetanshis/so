import express, { Response } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import session from "express-session"
import path from "path";
import mainRouter from "./routes/mainRoutes";
import passport from "passport";
import prisma from "./config/prisma";
import  admin  from"firebase-admin";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
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

 
process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
app.post("/send", function(req, res){
  const recivedToken = req.body.fcmToken;
  const message = {
    notification: {
        title: "Hi",
        body:"This is a test"
    },
    token :"favvqjssqsahssaeatsss1sucp65464hjfsdjk02136",
  };

  getMessaging()
    .send(message)
    .then((response:any) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: recivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error:any) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
 
})
  initializeApp({
    credential: applicationDefault(),
    projectId: 'smart-irrigation-60277'
  });
  
app.use("", mainRouter);
app.listen(`${process.env.PORT}`, () =>{
    console.log(`Sever is running on this PORT:-${process.env.PORT}`)
})

