import express from 'express';
import profileController from '../controllers/profileController.js';
import dashboardController from '../controllers/dashboardController.js';
import {joinContestController} from '../controllers/contestController.js';
import authMiddleware from '../middlewares/auth.js';
import basicUserInfo from '../middlewares/basicUserInfo.js';
import contestPass from '../middlewares/contestPass.js';
const router = express.Router();

router.get('/profile/:username', async(req, res) => {
    await profileController(req, res);
});

router.post('/dashboard', authMiddleware, basicUserInfo, async(req, res) => {
    await dashboardController(req, res);
});


router.post('/contest/join/:contestId', authMiddleware, contestPass, async(req, res) => {
    await joinContestController(req, res);
});


router.post('/rules', async(req, res) => {
    await joinContestController(req, res);
});


export default router;