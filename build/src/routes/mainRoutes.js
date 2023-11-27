"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRoutes_1 = __importDefault(require("./apiRoutes"));
const authRoutes_1 = require("./authRoutes");
const mainRouter = (0, express_1.Router)();
mainRouter.use("/api", apiRoutes_1.default);
const authRouter = new authRoutes_1.AuthRoutes().getRouter();
mainRouter.use("/auth", authRouter);
exports.default = mainRouter;
