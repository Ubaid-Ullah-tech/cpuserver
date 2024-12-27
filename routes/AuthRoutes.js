import express from 'express';
import { forgotPasswordController, loginController, registerController } from '../controller/authController.js';

const router =  express.Router();

// register routing
router.post('/register', registerController)
// login routing
router.post('/login', loginController)
// Forgot passwordd

router.post('/forgot-password', forgotPasswordController)

export default router;
