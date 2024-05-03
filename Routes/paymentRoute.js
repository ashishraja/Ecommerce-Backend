import express from "express";
import {
  paymentVerification,
  processPayment,
} from "../Controllers/paymentControllers.js";
const router = express.Router();
import { isAuthenticatedUser } from "../Middleware/authentication.js";
router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/paymentverification").post(paymentVerification);
export default router