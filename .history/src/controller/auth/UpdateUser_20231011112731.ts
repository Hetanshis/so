import { Request, Response } from "express";
import prisma from "../../config/prisma";

const update_User = async(req:Request, res:Response) => {
    try{
        const id:any = req.params.id
      const {name, email, contactNumber}:{name:string, email:string, contactNumber:string} = req.body

      const existngUser = await prisma.user.findFirst({where:{email, contactNumber}})
      if(existngUser){
        return res.status(200).json({status:false, message:"User is already exist"});
      }

      const updateUser = await prisma.user.updateMany({where:{id: id}, data:{name, email, contactNumber}})

      if(!updateUser){
              return res.status(200).json({status:false, messgae:"User is not update profile"})
      }

      return res.status(200).json({status:true, message:"User is update successfully", data:updateUser});
    }catch(err:any){
        return res.status(500).json({status:false, message:err.message})
    }
}
export default update_User