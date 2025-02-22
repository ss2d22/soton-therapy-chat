import { Context } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { hash, compare } from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { User } from "../models/User.ts";

const JWT_KEY = Deno.env.get("JWT_ENCRYPTION_KEY") || "secret";

/**
 * Handles user registration.
 * Manually hashes the password and inserts the user into MongoDB.
 * Returns a JWT in an httpOnly cookie.
 */
export const signUp = async (ctx: Context) => {
  console.log("ctx : ", ctx);
  console.log("ctx.request.body : ", await ctx.request.body.json());

  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No body provided" };
      return;
    }

    const body = ctx.request.body;
    const data = await body.json();

    const { email, password } = data;

    if (!email || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Email and password required" };
      return;
    }

    const hashedPassword = await hash(password);

    const insertId = await User.insertOne({
      email,
      password: hashedPassword,
      firstName: "",
      lastName: "",
      avatar: "",
      theme: "",
      configuredProfile: false,
    });

    console.log("id", insertId.toString());

    const token = await create(
      { alg: "HS512", typ: "JWT" },
      { id: insertId.toString(), exp: getNumericDate(60 * 60 * 24) },
      JWT_KEY
    );

    console.log("token : ", token);

    await ctx.cookies.set("jwt", token, { httpOnly: true });

    ctx.response.status = 201;
    ctx.response.body = {
      user: {
        id: insertId.toString(),
        email,
        firstName: "",
        lastName: "",
        avatar: "",
        theme: "",
        configuredProfile: false,
      },
    };
  } catch (error) {
    console.error("Error in signUp:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};
/**
 * Handles user login.
 * Verifies credentials and sets a JWT cookie.
 */
export const signIn = async (ctx: Context) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No body provided" };
      return;
    }

    const data = await ctx.request.body.json();
    const { email, password } = data;

    if (!email || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Email and password required" };
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Email not found" };
      return;
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Incorrect password" };
      return;
    }

    const token = await create(
      { alg: "HS512", typ: "JWT" },
      { id: user._id, exp: getNumericDate(60 * 60 * 24) },
      JWT_KEY
    );

    await ctx.cookies.set("jwt", token, { httpOnly: true });

    ctx.response.status = 200;
    ctx.response.body = {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        theme: user.theme,
        configuredProfile: user.configuredProfile,
      },
    };
  } catch (error) {
    console.error("Error during signIn:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

/**
 * Retrieves authenticated user information.
 * Assumes a JWT middleware has set ctx.state.userId.
 */
export const fetchUserInfo = async (ctx: Context) => {
  try {
    const userId = ctx.state.userId;
    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { error: "User not authenticated" };
      return;
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { error: "User not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        theme: user.theme,
        configuredProfile: user.configuredProfile,
      },
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

/**
 * Handles user sign out by clearing the JWT cookie.
 */
export const signOut = async (ctx: Context) => {
  try {
    await ctx.cookies.delete("jwt");
    ctx.response.status = 200;
    ctx.response.body = { message: "Sign out successful" };
  } catch (error) {
    console.error("Error during signOut:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};
