import { Request, Response } from "express";

const update_User = async(req:Request, res:Response) => {
    try{

    }catch(err:any){
        return res.status(500).json({status:false, message:err.meessage})
    }
}