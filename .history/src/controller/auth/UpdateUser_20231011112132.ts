import { Request, Response } from "express";
import prisma from "../../config/prisma";

const update_User = async(req:Request, res:Response) => {
    try{
        
      const {name, email, contactNumber}:{name:string, email:string, contactNumber:string} = req.body

      const existngUser = await prisma.user.findFirst({where:{email, contactNumber}})
      if(existngUser){
        return res.status(200).json({status:false, message:"User is already exist"})
      }
    }catch(err:any){
        return res.status(500).json({status:false, message:err.meessage})
    }
}
export default update_User