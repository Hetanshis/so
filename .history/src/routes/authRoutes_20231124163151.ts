import { Router } from "express";
import { AuthController } from "../controller/authController";

export class AuthRoutes {
    private router: Router;
    public authController: AuthController= new AuthController();
    constructor(){
        this.router = Router();
        this.authController = new AuthController();
        this.routes();
    }
    private routes(){
        const {signUp, signIn} = this.authController
        this.router.post("/signUp", signUp )
        
        this.router.post("/signIn", signIn)
    }

    public getRouter() {
        return this.router;
      }
}
