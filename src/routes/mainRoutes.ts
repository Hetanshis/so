import { Router } from "express";
import ApiRoutes from "./apiRoutes";
import { AuthRoutes } from "./authRoutes";

const mainRouter: Router = Router();


mainRouter.use("/api", ApiRoutes)

const authRouter: Router = new AuthRoutes().getRouter();
mainRouter.use("/auth", authRouter);

export default mainRouter