import express from 'express'
import { deleteUser, forgotPassword, getAllUsers, getSingleUserDetails, getUserDetails, loginUser, logout, register, resetPassword, updatePassword, updateProfile, updateProfilePicture, updateUserRole }from "../Controllers/userController.js";
import { authorizeRoles, isAuthenticatedUser } from "../Middleware/authentication.js";
import { singleUpload } from '../Middleware/Multer.js';


const router = express.Router();

router.route("/register").post(singleUpload , register);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/updateprofile").put(isAuthenticatedUser , updateProfile);

router.route("/me/updateprofilepicture").put(isAuthenticatedUser , singleUpload , updateProfilePicture);

router
  .route("/admin/users")
  .get(isAuthenticatedUser , authorizeRoles , getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles , getSingleUserDetails)
  .put(isAuthenticatedUser, authorizeRoles , updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles , deleteUser);

export default router;