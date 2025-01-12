import express from 'express';
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/registerController.js';

const router = express.Router();


router.post('/login', async(req, res) => {
    await loginController(req, res);
});

router.post('/register', async(req, res) => {
    await registerController(req, res);
});


export default router;