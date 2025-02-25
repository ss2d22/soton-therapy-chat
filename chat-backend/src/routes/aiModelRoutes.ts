import { Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import {
  getActiveAIModels,
  getAIModelById,
  getAIModelsForUser,
} from "../controllers/aiModelController.ts";
import { searchAIModels } from "../controllers/messageController.ts";
import { verifyJWT } from "../middlewares/authenticationMiddleware.ts";

const aiModelRouter: Router = new Router();

/**
 * @swagger
 * /api/aimodels:
 *   get:
 *     summary: Get all active AI models
 *     description: Retrieves a list of all active AI models
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of AI models
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       500:
 *         description: Internal server error
 */
aiModelRouter.get("/", verifyJWT, getActiveAIModels);

/**
 * @swagger
 * /api/aimodels/search:
 *   post:
 *     summary: Search AI models
 *     description: Search for AI models by name or description
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
aiModelRouter.post("/search", verifyJWT, searchAIModels);

/**
 * @swagger
 * /api/aimodels/user:
 *   post:
 *     summary: Get AI models for user
 *     description: Get AI models a user has interacted with
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: number
 *     responses:
 *       200:
 *         description: List of AI models
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
aiModelRouter.post("/user", verifyJWT, getAIModelsForUser);

/**
 * @swagger
 * /api/aimodels/{id}:
 *   get:
 *     summary: Get an AI model by ID
 *     description: Retrieves a specific AI model by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the AI model
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: AI model details
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: AI model not found
 *       500:
 *         description: Internal server error
 */
aiModelRouter.get("/:id", verifyJWT, getAIModelById);

export default aiModelRouter;
