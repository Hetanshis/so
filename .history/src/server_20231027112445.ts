import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import mainRouter from "./routes/mainRoutes";
import passport from "passport";
import prisma from "./config/prisma";
import admin from "firebase-admin";
const FCM = require("fcm-node");
import { applicationDefault, initializeApp } from "firebase-admin/app";

// var serviceAccount = require("src\config\smart-irrigation-60277-firebase-adminsdk-3pp7z-73bccdca28.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

dotenv.config();
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: `${process.env.SECRET_KEY}`,
    resave: true,
    saveUninitialized: true,
  })
);

const jwtOptions = {
  secretOrKey: `${process.env.SECRET_KEY}`,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
    const user: any = await prisma.user.findFirst(payload.id);
    console.log(user, "user1");
    if (!user) {
      return done(null, false);
    }

    // return with Json file
    done(null, user.toJSON());
  })
);

passport.serializeUser((user: any, done) => {
  console.log(user, "user2");
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    console.log(user, "user3");
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

const SERVER_KEY =
  "AAAAuWgryR4:APA91bE7Ij5bmUV4FiiTvNUt5GnemQJOnj-Y68rDUB79g40eUGI6lZXQtNQDXaAKYx5FoUjh9vTPnqh1MTNmrpI4SZZ2tgY6LB3fErVCuZAdY7JOQj3BwPr6czzkYGl6_XKNUdLzYoZe";

// app.post("/send", function(req, res){
//   const recivedToken = req.body.fcmToken;
//   const message = {
//     notification: {
//         title: "Hi",
//         body:"This is a test"
//     },
//     token :"favvqjssqsahssaeatsss1sucp65464hjfsdjk02136",
//   };

//   getMessaging()
//     .send(message)
//     .then((response:any) => {
//       res.status(200).json({
//         message: "Successfully sent message",
//         token: recivedToken,
//       });
//       console.log("Successfully sent message:", response);
//     })
//     .catch((error:any) => {
//       res.status(400);
//       res.send(error);
//       console.log("Error sending message:", error);
//     });

// })
app.post("/fcm", async (req, res, next) => {
  try {
    const { title, body, topic } = req.body;
    let fcm = new FCM(SERVER_KEY);
    let message = {
      to: "/topics/" + topic,
      notification: {
        title,
        body,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
      data: req.body.data,
    };

    const notification = await prisma.noitification.create({
      data: { title, body, topic },
    });
  
    if (!notification) {
      return res.json({ message: "Not send" });
    }

    console.log("message", message);
    fcm.send(message, (err: any, response: any) => {
      if (err) {
        next(err);
      } else {
        res.json(response);
      }
    });
  
  } catch (err) {
    next(err);
  }
});
initializeApp({
  credential: applicationDefault(),
  projectId: "smart-irrigation-60277",
});

app.use("", mainRouter);
app.listen(`${process.env.PORT}`, () => {
  console.log(`Sever is running on this PORT:-${process.env.PORT}`);
});
