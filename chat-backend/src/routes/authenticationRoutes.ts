import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import {
  signUp,
  signIn,
  fetchUserInfo,
  signOut,
} from "../controllers/authenticationController.ts";
import { verifyJWT } from "../middlewares/authenticationMiddleware.ts";

const authRouter: Router = new Router();

/**
 * @swagger
 * /api/authentication/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email and password. Returns a JWT cookie upon successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - email or password missing
 *       500:
 *         description: Internal server error
 */
authRouter.post("/signup", signUp);

/**
 * @swagger
 * /api/authentication/signin:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user and returns a JWT cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post("/signin", signIn);

/**
 * @swagger
 * /api/authentication/fetchuserinfo:
 *   get:
 *     summary: Fetch user info
 *     description: Retrieves user information based on JWT authentication.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       500:
 *         description: Internal server error
 */
authRouter.get("/fetchuserinfo", verifyJWT, fetchUserInfo);

/**
 * @swagger
 * /api/authentication/signout:
 *   post:
 *     summary: Sign out user
 *     description: Clears the JWT cookie to log out the user.
 *     responses:
 *       200:
 *         description: Sign out successful
 *       500:
 *         description: Internal server error
 */
authRouter.post("/signout", signOut);

export default authRouter;
