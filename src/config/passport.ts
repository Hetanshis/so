import passport from "passport";
import prisma from "./prisma";
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({usernameField:'email', passwordField: 'password'}, async function(email:any,password:any,cb:any){
    const user = await prisma.user.findFirst({ where: { email: email, password: password } });
    if (!user) {
        return cb(null, false, { message: "Incorrect email or password" });
    }
    return cb(null, true, { message: "User logged in successfully" }).catch((err:any) =>{
        return cb(null, false, {message:err.message})
    })
}))
