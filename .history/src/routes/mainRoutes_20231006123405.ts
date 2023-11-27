import { Router } from "express";
import { AuthRoutes } from "./authRoutes";

const mainRouter: Router = Router();

// Auth Api routes
const authRouter: Router = new AuthRoutes().getRouter();
mainRouter.use("/api/auth", authRouter);

export default mainRouter;