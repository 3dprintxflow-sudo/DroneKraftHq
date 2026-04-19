import { Router } from "express";
import { verifyJWT } from "../../middleware/verifyJWT";
import { dummyPayment } from "../../controllers/paymentController";

const router = Router();

router.post("/dummy", verifyJWT, dummyPayment);

export default router;
