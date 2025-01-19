import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import basicUserInfo from '../middlewares/basicUserInfo.js';

import { userListController, problemListController, addProblemController, deleteProblemController } from '../controllers/adminController.js';
const router = express.Router();

const isAdmin = async (req, res, next) => {
    if (!req.user.profile.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
        });
    }
    next();
}

const isSuperAdmin = async (req, res, next) => {
    if (!req.user.profile.isSuperAdmin) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this resource"
        });
    }
    next();
}
router.post('/UserList', authMiddleware, basicUserInfo, isAdmin, async(req, res) => {
    await userListController(req, res);
});

router.post('/problemList', authMiddleware, basicUserInfo, isSuperAdmin, async(req, res) => {
    await problemListController(req, res);
});


router.post('/addProblem', authMiddleware, basicUserInfo, isSuperAdmin, async(req, res) => {
    await addProblemController(req, res);
});

router.post('/deleteProblem', authMiddleware, basicUserInfo, isSuperAdmin, async(req, res) => {
    await deleteProblemController(req, res);
})

export default router;