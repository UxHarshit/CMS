import express from 'express';
import profileController from '../controllers/profileController.js';
import dashboardController from '../controllers/dashboardController.js';
import {joinContestController} from '../controllers/contestController.js';

const router = express.Router();

router.get('/profile/:username', async(req, res) => {
    await profileController(req, res);
});

router.post('/dashboard', async(req, res) => {
    await dashboardController(req, res);
});


router.post('/contest/join/:contestId', async(req, res) => {
    await joinContestController(req, res);
});


router.post('/rules', async(req, res) => {
    await joinContestController(req, res);
});


export default router;