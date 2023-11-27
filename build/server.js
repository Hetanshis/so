"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const mainRoutes_1 = __importDefault(require("./src/routes/mainRoutes"));
const passport_1 = __importDefault(require("passport"));
const prisma_1 = __importDefault(require("./src/config/prisma"));
const FCM = require("fcm-node");
require("./src/config/auth");
const app_1 = require("firebase-admin/app");
// var serviceAccount = require("src\config\smart-irrigation-60277-firebase-adminsdk-3pp7z-73bccdca28.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: `${process.env.SECRET_KEY}`,
    resave: true,
    saveUninitialized: true,
}));
const jwtOptions = {
    secretOrKey: `${process.env.SECRET_KEY}`,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
passport_1.default.use(new JwtStrategy(jwtOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst(payload.id);
    console.log(user, "user1");
    if (!user) {
        return done(null, false);
    }
    // return with Json file
    done(null, user.toJSON());
})));
passport_1.default.serializeUser((user, done) => {
    console.log(user, "user2");
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findFirst({ where: { id } });
        console.log(user, "user3");
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, express_session_1.default)({ secret: "cats" }));
const SERVER_KEY = "AAAAuWgryR4:APA91bE7Ij5bmUV4FiiTvNUt5GnemQJOnj-Y68rDUB79g40eUGI6lZXQtNQDXaAKYx5FoUjh9vTPnqh1MTNmrpI4SZZ2tgY6LB3fErVCuZAdY7JOQj3BwPr6czzkYGl6_XKNUdLzYoZe";
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
app.post("/fcm", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body, topic } = req.body;
        let fcm = new FCM(SERVER_KEY);
        let message = {
            to: `/topics/${topic}`,
            notification: {
                title,
                body,
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon",
            },
            data: req.body.data,
        };
        const notification = yield prisma_1.default.noitification.create({
            data: { title, body, topic },
        });
        if (!notification) {
            return res.json({ message: "Not send" });
        }
        // const response = await fcm.send(message);
        // if(response === 0 ){
        //   res.json({
        //     message: "Notification sent, but not to any devices."
        //     });
        // }else{
        //   res.json({
        //     message: "Notification sent successfully."
        //     });
        // }
        fcm.send(message, (err, response) => {
            if (err) {
                console.log(response);
                next(err);
            }
            else {
                console.log(response);
                res.json(response);
            }
        });
    }
    catch (err) {
        next(err);
    }
}));
(0, app_1.initializeApp)({
    credential: (0, app_1.applicationDefault)(),
    projectId: "smart-irrigation-60277",
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('<a href="/auth/google">Authentication with Google</a>');
}));
app.get("/auth/google/callback", passport_1.default.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: "/auth/failure"
}));
app.get("/auth/google", passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
app.use("", mainRoutes_1.default);
app.get("/protected", isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});
app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            // Handle any errors that occurred during logout.
            console.error(err);
            return next(err);
        }
        req.session.destroy(function () {
            res.send("Goodbye!");
        });
    });
});
app.get("/auth/failure", (req, res) => {
    res.send("something went wrong...");
});
app.get("/users", (req, res) => {
    res.send("something went wrong...");
    console.log("Hellonsmmdsamfsdfdf");
});
app.listen(`${process.env.PORT}`, () => {
    console.log(`Sever is running on this PORT:-${process.env.PORT}`);
});
exports.default = app;
