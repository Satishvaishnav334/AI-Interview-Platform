import { Router } from "express";
import {
    createSession,
    updateSession,
    deleteSession,
    getSession,
    getSessionData,
    getSessionDataBySocketId,
    getAllSessions,
} from "../controllers/session.controller";

const router = Router()

router.route('/').post(createSession).delete(deleteSession)
router.route('/data/:socketId').get(getSessionDataBySocketId)
router.route('/history/:id').get(getSessionData)
router.route('/:userId').get(getSession).patch(updateSession)
router.route('/all/:email').get(getAllSessions)

export default router;