import express from 'express';
import { runProblemController, getProblemController, updateProblemController, submitProblemController } from '../controllers/problemController.js';
import { authMiddleware } from '../middlewares/auth.js';
import basicUserInfo from '../middlewares/basicUserInfo.js';


const router = express.Router();


router.post('/run', (req, res) => {
    runProblemController(req, res);
});

router.get('/:id', authMiddleware, (req, res) => {
    getProblemController(req, res);
});

router.put('/:id', authMiddleware, (req, res) => {
    updateProblemController(req, res);
});

router.post('/submit',authMiddleware,basicUserInfo, (req, res) => {
    submitProblemController(req, res);
});


export default router;