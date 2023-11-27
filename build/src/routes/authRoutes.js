"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const authController_1 = require("../controller/authController");
class AuthRoutes {
    constructor() {
        this.authController = new authController_1.AuthController();
        this.router = (0, express_1.Router)();
        this.authController = new authController_1.AuthController();
        this.routes();
    }
    routes() {
        console.log(this.authController); // Check if authController is defined
        const { signUp, signIn } = this.authController;
        console.log(signUp, signIn);
        this.router.post("/signUp", signUp);
        this.router.post("/signIn", signIn);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
