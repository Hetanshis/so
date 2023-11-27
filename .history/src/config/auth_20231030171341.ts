import passport from "passport";
import dotenv from 'dotenv';
dotenv.config();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
    done(null, profile)
  }
));


passport.serializeUser((user: any, done) => {
   
    done(null, user);
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