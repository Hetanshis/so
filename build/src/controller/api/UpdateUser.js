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
const update_User = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, contactNumber } = req.body;
        const existngUser = yield prisma_1.default.user.findFirst({ where: { email, contactNumber } });
        if (existngUser) {
            return res.status(200).json({ status: false, message: "User is already exist" });
        }
        const updateUser = yield prisma_1.default.user.updateMany({ where: { id: req.body.id }, data: { name, email, contactNumber } });
        if (!updateUser) {
            return res.status(200).json({ status: false, messgae: "User is not update profile" });
        }
        return res.status(200).json({ status: true, message: "User is update successfully", data: updateUser });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});
exports.default = update_User;
