"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addUser_1 = __importDefault(require("../controller/api/addUser"));
const ListUser_1 = __importDefault(require("../controller/api/ListUser"));
const stream_1 = require("stream");
const multer_1 = __importDefault(require("multer"));
const xlsx_1 = __importDefault(require("xlsx"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const UpdateUser_1 = __importDefault(require("../controller/api/UpdateUser"));
const prisma_1 = __importDefault(require("../config/prisma"));
const ApiRoutes = (0, express_1.Router)();
ApiRoutes.post("/create", addUser_1.default);
ApiRoutes.get("/lists", ListUser_1.default);
// Set up the storage engine for multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
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
ApiRoutes.post('/upload/list', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Process Excel file (xlsx)
        const workbook = xlsx_1.default.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(sheet);
        // Store the data in the `prisma.import_data` table.
        const savedData = yield prisma_1.default.import_data.create({ data });
        console.log(savedData, "save");
        return res.status(201).json({
            success: true,
            message: 'Rows added to the database.',
        });
    }
    else if (file.mimetype === 'text/csv') {
        // Process CSV file
        const results = [];
        const fileStream = stream_1.Readable.from(file.buffer.toString());
        fileStream
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            console.log(data, ":data");
            results.push(data);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            // Save CSV data to the database
            const savedData = yield prisma_1.default.import_data.createMany({ data: results });
            console.log(savedData, "save");
            res.json({
                success: true,
                message: 'Rows added to the database.',
            });
        }));
    }
    else {
        // Unsupported file format
        res.status(400).send('Unsupported file format.');
    }
}));
ApiRoutes.post("/update", UpdateUser_1.default);
exports.default = ApiRoutes;
