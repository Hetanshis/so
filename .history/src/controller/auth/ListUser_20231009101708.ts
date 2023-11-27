import { Request, Response } from "express";
import prisma from "../../config/prisma";
import path from "path";
import ejs from "ejs";

const List_User = async(req:Request, res:Response) => {
    try{

        const users = await prisma.user.findMany()
        if(!users){
            return res.status(200).json({status:false, message:"User not get Lists"})
        }

        // const templatePath = path.join(
        //     __dirname,
        //     "../",
        //     "resources",
        //     "users.ejs"
        //   );

        //   const emailtemplate = await ejs.renderFile(templatePath, {
        //  users: users
        //   });
  
          
        // if (req.headers["content-type"] === "application/json") {
            return res.status(200).json({status:true, message:"User Get Lists successfully", data: users})
          // } else {
          //   return res.render("users", {
          //     status: false,
          //     type: null,
          //    data: users
          //   });
          // }
       
    }catch(err:any){
        return res.status(500).json({status:false, message:err.message})
    }
} 

export default List_User