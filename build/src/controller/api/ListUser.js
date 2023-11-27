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
const List_User = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany();
        if (!users) {
            return res.status(200).json({ status: false, message: "User not get Lists" });
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
        if (req.headers["content-type"] === "application/json") {
            return res.status(200).json({ status: true, message: "User Get Lists successfully", data: users });
        }
        else {
            return res.render("users", {
                status: false,
                data: users
            });
            // const html = await ejs.renderFile('users' /*{data goes here if necessary}*/)
            // res.send(html)   
        }
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});
exports.default = List_User;
