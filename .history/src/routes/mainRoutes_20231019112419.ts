import { Router } from "express";
import ApiRoutes from "./apiRoutes";

const main_Routes = Router();
main_Routes.use("/api", ApiRoutes);
main_Routes.use("/auth", )
export default main_Routes