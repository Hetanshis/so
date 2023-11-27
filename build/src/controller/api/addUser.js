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
const Sign_Up = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, contactNumber } = req.body;
        const existingUser = yield prisma_1.default.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(200).json({ status: false, message: "User is already exist" });
        }
        const users = yield prisma_1.default.user.create({ data: { name, email, password, contactNumber } });
        if (!users) {
            return res.status(200).json({ status: false, message: "User is not added." });
        }
        return res.status(200).json({ status: true, message: "User is added successfully", data: users });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});
exports.default = Sign_Up;
