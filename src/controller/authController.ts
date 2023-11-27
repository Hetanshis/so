import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma"
import bcryptPassword from "../utils/bcryptPassword";
import passport from "passport";
import comparePassword from "../utils/comparePassword";
import jwt from "jsonwebtoken";
export class AuthController {
    public async signUp(req:Request, res:Response, next: NextFunction) {
        try{
         const {name,email,password,contactNumber}:{name:string,email:string,password:string,contactNumber:string} = req.body;

         const existingUser = await prisma.user.findFirst({where:{email:email,contactNumber:contactNumber}})

         if(existingUser){
            return res.status(200).json({status:false, message:"User is already exist"}) 
         }

         const hashPassword = await bcryptPassword(password);
         const user = await prisma.user.create({data:{name,email,password:hashPassword,contactNumber}})
         if(!user){
            return res.status(200).json({status:false, message:"User is not added"})
         }
         next();
         return res.status(200).json({status:true, message:"User is register successfully", data:user})

        }catch(err:any){
            return res.status(500).json({status:false, message:err.message})
        }
    }

    public async signIn(req:Request, res:Response,next: NextFunction) {
        try{
         passport.authenticate("local", async(err:any, info:any) =>{
            if (err) {
                return next(err);
              }
            console.log("hello")
            const {email, password} = req.body;
            console.log(req.body)

            const user:any = await prisma.user.findFirst({where:{email:email}})

            if(!user){
                return res.status(200).json({status:false, message:"User is already exist"})
            }

            if(!(await comparePassword(user.password, password))){
             return res.status(200).json({status:false, message:"Invalid Password"})
            }

            const foundUser = await prisma.user.findFirst(user.id)
            if(!foundUser){
                return res.status(200).json({status:false, message:"User is not found"})
            }
            const token = jwt.sign({id: foundUser.id}, `${process.env.SECRET_KEY}`);
            req.login(foundUser, (err:any) =>{
                if(err){
                    return next({ status: false, message: err });
                }
                next();
                return res.status(200).json({status:true, message:"Login successfully", data:{
                  _id: user.id,
                  name: user.name,
                  email: user.email,
                  contactNumber: user.contactNumber,
                  token: token,
                }})
            })

         })
        }catch(err:any){
             return res.status(200).json({status:false, message:err.message})
        }
    }
}


