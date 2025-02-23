import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { Payload, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { importKeyFromEnv } from "../utils/key.ts";

/**
 * JWT secret key from the env file converted to Cryptokey
 * @author Sriram Sundar
 *
 * @type {CryptoKey}
 */
const JWT_KEY: CryptoKey = await importKeyFromEnv();

/**
 * Verifies the JWT token in the cookie
 * @author Sriram Sundar
 *
 * @export
 * @async
 * @param {Context} ctx
 * @param {() => Promise<unknown>} next
 * @returns {Promise<void>}
 */
export async function verifyJWT(
  ctx: Context,
  next: () => Promise<unknown>
): Promise<void> {
  const token: string | undefined = await ctx.cookies.get("jwt");
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Authentication required";
    return;
  }
  try {
    const payload: Payload = await verify(token, JWT_KEY);

    ctx.state.userId = payload._id;
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 403;
    ctx.response.body = "Invalid token";
  }
}
