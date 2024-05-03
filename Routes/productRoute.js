import express from 'express'
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllProductReviews, deleteReview, getAdminProducts } from "../Controllers/productController.js";
import { authorizeRoles, isAuthenticatedUser } from "../Middleware/authentication.js";
import multipleUpload from '../Middleware/Multer.js';


const router = express.Router();
router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles , getAdminProducts);

router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles , multipleUpload , createProduct);
router.route("/admin/products/:id").
put(isAuthenticatedUser, authorizeRoles , multipleUpload , updateProduct)
.delete(isAuthenticatedUser, authorizeRoles ,deleteProduct)

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser ,createProductReview);
router.route("/reviews").get(getAllProductReviews).delete(isAuthenticatedUser , deleteReview);
export default router;