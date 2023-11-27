import passport from "passport";
import prisma from "./prisma";
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({usernameField:'email', passwordField: 'password'}, function(email,password,cb){
    return prisma.user.findFirst({where:{email:email,password:password}}).then((user) => {
        if(!user){
            return cb(null, false, {message:"Incorrect email or password"})
        }
        return cb(null, true, {message:"User logged in successfully"})

    })
}))
