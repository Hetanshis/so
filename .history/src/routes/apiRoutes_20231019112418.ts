import { Router } from "express";
import Sign_Up from "../controller/api/addUser";
import List_User from "../controller/api/ListUser";
import { Readable } from "stream";
import multer from 'multer';
import XLSX from "xlsx";
import csv from "csv-parser";
import update_User from "../controller/api/UpdateUser";
import prisma from "../config/prisma";



const ApiRoutes = Router();
ApiRoutes.post("/create", Sign_Up);
ApiRoutes.get("/lists", List_User)


// Set up the storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ApiRoutes.post('/upload/list', upload.single('file'), async(req, res) => {
//   console.log("hello")
//   const file = req.file;

// if (!file) {
//   return res.status(400).send('No file uploaded.');
// }

// if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//   const workbook = XLSX.read(file.buffer, { type: 'buffer' });
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data:any = XLSX.utils.sheet_to_json(sheet);
 

//   // Store the data in the `prisma.import_data` table.
//   const savedData = await prisma.import_data.create(data);

//   console.log(savedData, "save")

//   return res.status(201).json({
//     success: true,
//     message: 'Rows added to the database.',
//   });
// } else if (file.mimetype === 'text/csv') {
//   const results: any = [];
//   const fileStream = Readable.from(file.buffer.toString());

//   fileStream
//     .pipe(csv())
//     .on('data', (data: any) => {
//       console.log(data, ":data")
//       results.push(data);
//     })
//     .on('end', async () => {
//       res.json(results)
//     });
// } else {
//   res.status(400).send('Unsupported file format.');
// }
// });


ApiRoutes.post('/upload/list', upload.single('file'), async (req, res) => {
  console.log("hello");
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    // Process Excel file (xlsx)
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any = XLSX.utils.sheet_to_json(sheet);

    // Store the data in the `prisma.import_data` table.
    const savedData = await prisma.import_data.create({ data });      

    console.log(savedData, "save");

    return res.status(201).json({
      success: true,
      message: 'Rows added to the database.',
    });
  } else if (file.mimetype === 'text/csv') {
    // Process CSV file
    const results: any = [];
    const fileStream = Readable.from(file.buffer.toString());

    fileStream
      .pipe(csv())
      .on('data', (data: any) => {
        console.log(data, ":data");
        results.push(data);                                                     
      })
      .on('end', async () => {
        // Save CSV data to the database
        const savedData = await prisma.import_data.createMany ({ data: results });

        console.log(savedData, "save");

        res.json({
          success: true,
          message: 'Rows added to the database.',
        });
      });
  } else {
    // Unsupported file format
    res.status(400).send('Unsupported file format.');
  }
});

ApiRoutes.post("/update", update_User)
export default ApiRoutes
