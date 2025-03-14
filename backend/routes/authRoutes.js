import express from 'express';
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/registerController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { resendVerificationController, verifyMailController } from '../controllers/authController.js';

const router = express.Router();


router.post('/login', async(req, res) => {
    await loginController(req, res);
});

router.post('/register', async(req, res) => {
    await registerController(req, res);
});

router.post('/verify/resend',authMiddleware, async(req, res) => {
    await resendVerificationController(req, res);
});

router.post('/verify/mail',async(req, res) => {
    await verifyMailController(req, res);
});


export default router;