import { Request, Response } from "express";
import prisma from "../../config/prisma";

const update_User = async(req:Request, res:Response) => {
    try{
        const {id}:{id:string} = req.params;
      const {name, email, contactNumber}:{name:string, email:string, contactNumber:string} = req.body

      const existngUser = await prisma.user.update({where:{id:id}, data:{}})
    }catch(err:any){
        return res.status(500).json({status:false, message:err.meessage})
    }
}
export default update_User