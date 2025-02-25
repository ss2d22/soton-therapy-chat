import { Application, Router } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import authRouter from "./routes/authenticationRoutes.ts";
import messageRouter from "./routes/messageRoutes.ts";
import aiModelRouter from "./routes/aiModelRoutes.ts";
import setupSocket from "./utils/socketSetup.ts";

/**
 * port to run the server on
 *
 * @author Sriram Sundar
 * @type number
 *
 */
const PORT: number = Number(Deno.env.get("PORT")) || 3000;

/**
 * origin url for the frontend application
 *
 * @author Sriram Sundar
 * @type string
 */
const FRONT_ORIGIN: string = Deno.env.get("FRONT_ORIGIN") || "*";

/**
 * instance of an oak application
 *
 * @author Sriram Sundar
 * @type Application
 */
const app: Application = new Application();

// set up logging middleware for the application
app.use(async (ctx, next) => {
  const start: number = Date.now();
  await next();
  const ms: number = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});

// set up cors with oak's built in cors functionality
app.use(
  oakCors({
    origin: FRONT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

/**
 * oak router
 *
 * @author Sriram Sundar
 * @type Router
 */
const router: Router = new Router();

router.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = "Server for soton therapy chat app";
});

//use the oak router
app.use(router.routes());
router.use(
  "/api/authentication",
  authenticationRoutes.routes(),
  authenticationRoutes.allowedMethods()
);
app.use(router.allowedMethods());

// listen on the port defined in the env file or 3000 as a fallback
if (import.meta.main) {
  Deno.serve({
    handler,
    port: PORT,
    onListen: ({ port }) => {
      console.log(`Server running on http://localhost:${port}`);
    },
  });
}
export { app, router, io };
