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
const prisma_1 = __importDefault(require("../../config/prisma"));
const xlsx_1 = __importDefault(require("xlsx"));
const uploadXLSX = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("file");
        let path = req.file;
        var workbook = xlsx_1.default.readFile(path);
        var sheet_name_list = workbook.SheetNames;
        let jsonData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        if (jsonData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "xml sheet has no data",
            });
        }
        let savedData = yield prisma_1.default.import_data.create(jsonData);
        console.log(savedData, "saved");
        return res.status(201).json({
            success: true,
            message: "rows added to the database",
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = uploadXLSX;
