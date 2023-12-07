const express = require("express");
const authRouter = express.Router(); 

const authController = require('../../controllers/auth-controller');
const {authenticate}=require('../../middlewars/authenticate');
const {upload}=require('../../middlewars/upload');

const { UserSignupSchema, 
    UserSigninSchema, 
    validateBody } = require('../../schemas/userSchema');

authRouter.post("/register", upload.single('avatar'), validateBody(UserSignupSchema), authController.register);

authRouter.post("/login", validateBody(UserSigninSchema), authController.login);

authRouter.get("/current",  authenticate,  authController.current);

authRouter.post("/logout", authenticate,  authController.logout);

authRouter.patch("/subscription", authenticate,  authController.updateSubscription);


authRouter.patch("/avatars", authenticate, upload.single('avatar'), authController.updateAvatar);

module.exports = authRouter;



