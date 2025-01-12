import express from 'express';
import {rulesController,problemController} from '../controllers/contestController.js';


const router = express.Router();


router.post('/rules', async(req, res) => {
    await rulesController(req, res);
});

router.post('/problems', async(req, res) => {
    await problemController(req, res);
});




export default router;