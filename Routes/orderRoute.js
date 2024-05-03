import express from "express";
import { newOrder, getSingleOrder, myOrders, updateOrderStatus, deleteOrders, getAllOrders } from "../Controllers/orderControllers.js";
const router = express.Router();
import { authorizeRoles, isAuthenticatedUser } from "../Middleware/authentication.js";

router.route("/order/new").post(newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/order/:id")
.put(isAuthenticatedUser, authorizeRoles , updateOrderStatus)
.delete(isAuthenticatedUser, authorizeRoles , deleteOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles , getAllOrders);
export default router;