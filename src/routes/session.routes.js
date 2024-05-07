import { Router } from "express";
import userMongo from "../models/user.model.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await userMongo.findOne({ email: email });
    if (!userFound) return res.status(401).send("Usuario no encontrado");
    const matchPassword = await userMongo.comparePassword(
      password,
      userFound.password
    );
    if (!matchPassword)
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    res.redirect("/user-profile");
  } catch (error) {
    console.error(error);
    return res.status(403).json(error);
  }
});

sessionRouter.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

export default sessionRouter;