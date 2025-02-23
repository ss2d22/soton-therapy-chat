import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import {
  signUp,
  signIn,
  fetchUserInfo,
  signOut,
} from "../controllers/authenticationController.ts";
import { verifyJWT } from "../middlewares/authenticationMiddleware.ts";

const router: Router = new Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/fetchuserinfo", verifyJWT, fetchUserInfo);
router.post("/signout", signOut);

export default router;
