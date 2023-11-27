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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const passport_1 = __importDefault(require("passport"));
const comparePassword_1 = __importDefault(require("../utils/comparePassword"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, contactNumber } = req.body;
                const existingUser = yield prisma_1.default.user.findFirst({ where: { email: email, contactNumber: contactNumber } });
                if (existingUser) {
                    return res.status(200).json({ status: false, message: "User is already exist" });
                }
                const hashPassword = yield (0, bcryptPassword_1.default)(password);
                const user = yield prisma_1.default.user.create({ data: { name, email, password: hashPassword, contactNumber } });
                if (!user) {
                    return res.status(200).json({ status: false, message: "User is not added" });
                }
                next();
                return res.status(200).json({ status: true, message: "User is register successfully", data: user });
            }
            catch (err) {
                return res.status(500).json({ status: false, message: err.message });
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                passport_1.default.authenticate("local", (err, info) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return next(err);
                    }
                    console.log("hello");
                    const { email, password } = req.body;
                    console.log(req.body);
                    const user = yield prisma_1.default.user.findFirst({ where: { email: email } });
                    if (!user) {
                        return res.status(200).json({ status: false, message: "User is already exist" });
                    }
                    if (!(yield (0, comparePassword_1.default)(user.password, password))) {
                        return res.status(200).json({ status: false, message: "Invalid Password" });
                    }
                    const foundUser = yield prisma_1.default.user.findFirst(user.id);
                    if (!foundUser) {
                        return res.status(200).json({ status: false, message: "User is not found" });
                    }
                    const token = jsonwebtoken_1.default.sign({ id: foundUser.id }, `${process.env.SECRET_KEY}`);
                    req.login(foundUser, (err) => {
                        if (err) {
                            return next({ status: false, message: err });
                        }
                        next();
                        return res.status(200).json({ status: true, message: "Login successfully", data: {
                                _id: user.id,
                                name: user.name,
                                email: user.email,
                                contactNumber: user.contactNumber,
                                token: token,
                            } });
                    });
                }));
            }
            catch (err) {
                return res.status(200).json({ status: false, message: err.message });
            }
        });
    }
}
exports.AuthController = AuthController;
