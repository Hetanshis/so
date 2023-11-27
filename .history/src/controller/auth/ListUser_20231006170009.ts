import { Request, Response } from "express";
import prisma from "../../config/prisma";

const List_User = async(req:Request, res:Response) => {
    try{

        const users = await prisma.user.findMany();
        if(!users){
            return res.status(200).json({status:false, meessage:"User not get Lists"})
        }
        return res.status(200).json({status:true, message:"User Get Lists successfully", data: users})
    }catch(err:any){
        return res.status(500).json({status:false, message:err.message})
    }
}