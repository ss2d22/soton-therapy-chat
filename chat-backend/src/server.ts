import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

/**
 * port to run the server on 
 *
 * @author Sriram Sundar
 * @type number
 *
 */
const PORT: number = Number(Deno.env.get("PORT")) || 3000;

/**
 * mongodb server url 
 *
 * @author Sriram Sundar
 * @type string
 */
const MONGO_URI: string = Deno.env.get("MONGODB_URI") || "";

/**
 * origin url for the frontend application 
 *
 * @author Sriram Sundar
 * @type string
 */
const FRONT_ORIGIN: string = Deno.env.get("FRONT_ORIGIN") || "*";

/**
 * oak application 
 *
 * @author Sriram Sundar
 * @type Application
 */
const app : Application = new Application();

// set up logging middleware for the application
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
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
app.use(router.allowedMethods());

// lisgen on the port defined in the env file or 3000 as a fallback
if (import.meta.main) {
  app.addEventListener("listen", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  await app.listen({ port: PORT });
}

export { app, router };



