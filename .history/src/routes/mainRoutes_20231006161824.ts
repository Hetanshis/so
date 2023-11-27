import { Router } from "express";
import AuthRoutes from "./authRoutes";

const main_Routes = Router();
main_Routes.use("/user", AuthRoutes);
export default main_Routes