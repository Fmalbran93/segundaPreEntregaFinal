import { Router } from "express";
import * as authctrl from "../controllers/userManager.js";

const authRouter = Router();

authRouter.post("/signup", authctrl.signup);
authRouter.post("/signin", authctrl.signin);

export default authRouter;