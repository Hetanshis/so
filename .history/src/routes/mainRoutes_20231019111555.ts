import { Router } from "express";
import ApiRoutes from "./authRoutes";

const main_Routes = Router();
main_Routes.use("/user", ApiRoutes);
export default main_Routes