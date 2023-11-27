import { Request, Response } from "express";
import prisma from "../../config/prisma";

const Sign_Up = async(req:Request, res:Response) => {
    try{
        const {name,email,password,contactNumber}:{name:string, email:string,password:string, contactNumber:string} = req.body

        const existingUser = await prisma.user.findFirst({where:{email}})
        if(existingUser){
            return res.status(200).json({status:false, message:"User is already exist"})
        }
        const users = await prisma.user.create({data:{name,email,password,contactNumber}});

        

        return res.status(200).json({status:true, message:"User is added successfully"})
    }catch(err:any){
        return res.status(500).json({status:false, message:err.message})
    }
}
export default Sign_Up