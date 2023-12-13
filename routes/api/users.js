const express = require("express");
const authRouter = express.Router(); 

const authController = require('../../controllers/auth-controller');
const {authenticate}=require('../../middlewars/authenticate');
const {upload}=require('../../middlewars/upload');

const { UserSignupSchema, 
    UserSigninSchema, 
    UserEmailSchema,
    validateBody } = require('../../schemas/userSchema');

authRouter.post("/register", upload.single('avatar'), validateBody(UserSignupSchema), authController.register);

authRouter.get("/verify/:verificationToken", validateBody(UserEmailSchema), authController.verify);

authRouter.post("/verify", authController.resendVerify);

authRouter.post("/login", validateBody(UserSigninSchema), authController.login);

authRouter.get("/current",  authenticate,  authController.current);

authRouter.post("/logout", authenticate,  authController.logout);

authRouter.patch("/subscription", authenticate,  authController.updateSubscription);


authRouter.patch("/avatars", authenticate, upload.single('avatar'), authController.updateAvatar);

module.exports = authRouter;



