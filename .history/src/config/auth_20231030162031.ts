// import passport from "passport";
// import prisma from "./prisma";
// const GoogleStrategy = require('passport-google-oauth').Strategy

// passport.use(new GoogleStrategy({
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECERT,
//     callbackURL: "http://127.0.0.1:8000/",
//     passReqToCallback: true
// },
// function(request, accessToken, refreshToken, profile, done){
//     prisma.user.create({googleId: profile.id})
// }
// ))