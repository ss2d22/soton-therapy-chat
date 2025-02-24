import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { fetchMessages } from "../controllers/messageController.ts";
import { verifyJWT } from "../middlewares/authenticationMiddleware.ts";

const messageRouter: Router = new Router();

messageRouter.post("/fetchMessages", verifyJWT, fetchMessages);

export default messageRouter;
