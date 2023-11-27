import { Request, Response } from "express";
import prisma from "../../config/prisma";
import XLSX from "xlsx";

const uploadXLSX = async (req:Request, res:Response) => {
    try {
      let path = req.file.path;
      var workbook = XLSX.readFile(path);
      var sheet_name_list = workbook.SheetNames;
      let jsonData:any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      if (jsonData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "xml sheet has no data",
        });
      }
      let savedData = await prisma.import_data.create(jsonData)
  
      return res.status(201).json({
        success: true,
        message:  " rows added to the database",
      });
    } catch (err:any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  export default uploadXLSX