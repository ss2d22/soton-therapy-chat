import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const JWT_KEY = Deno.env.get("JWT_ENCRYPTION_KEY") || "secret";

export async function verifyJWT(ctx: Context, next: () => Promise<unknown>) {
  const token = await ctx.cookies.get("jwt");
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Authentication required";
    return;
  }
  try {
    const payload = await verify(token, JWT_KEY, "HS256");
    // Attach user id to context state (assumes payload includes an "id" field)
    ctx.state.userId = payload.id;
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 403;
    ctx.response.body = "Invalid token";
  }
}
