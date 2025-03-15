import express from 'express';
import {rulesController,problemController, isFirstTime,acceptController} from '../controllers/contestController.js';
import { authMiddleware } from '../middlewares/auth.js';
import basicUserInfo from '../middlewares/basicUserInfo.js';


const router = express.Router();


router.post('/rules', async(req, res) => {
    await rulesController(req, res);
});

router.post('/problems', async(req, res) => {
    await problemController(req, res);
});

router.post('/isFirstTime', authMiddleware,basicUserInfo,async(req, res) => {
    await isFirstTime(req, res);
});

router.post('/accept',authMiddleware,basicUserInfo,async(req, res) => {
    await acceptController(req, res);
});


export default router;