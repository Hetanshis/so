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
const passport_1 = __importDefault(require("passport"));
const prisma_1 = __importDefault(require("./prisma"));
const LocalStrategy = require("passport-local").Strategy;
passport_1.default.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findFirst({ where: { email: email, password: password } });
        if (!user) {
            return cb(null, false, { message: "Incorrect email or password" });
        }
        return cb(null, true, { message: "User logged in successfully" }).catch((err) => {
            return cb(null, false, { message: err.message });
        });
    });
}));
