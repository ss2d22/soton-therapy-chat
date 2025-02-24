import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createMockContext } from "https://deno.land/x/oak@v17.1.4/testing.ts";
import {
  signUp,
  signIn,
  fetchUserInfo,
  signOut,
} from "../../src/controllers/authenticationController.ts";
import { deps } from "../../src/deps.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

// Helper: create a ReadableStream for a JSON body.
function createJsonBody(
  data: Record<string, unknown>
): ReadableStream<Uint8Array> {
  const json = JSON.stringify(data);
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(json));
      controller.close();
    },
  });
}

// Save original dependency functions to restore later.
const originalFindUserByEmail = deps.findUserByEmail;
const originalInsertUser = deps.insertUser;
const originalFindUserById = deps.findUserById;
const originalCompare = deps.compare;

// ----------------------
// signUp Tests
// ----------------------

Deno.test("signUp: returns 400 if no body provided", async () => {
  const ctx = createMockContext({ method: "POST", path: "/signup" });
  await signUp(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "No body provided" });
});

Deno.test("signUp: returns 400 if email or password missing", async () => {
  const ctx = createMockContext({
    method: "POST",
    path: "/signup",
    body: createJsonBody({ email: "test@example.com" }),
  });
  await signUp(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email and password required" });
});

Deno.test("signUp: returns 400 if email already in use", async () => {
  const fakeUser = {
    _id: new ObjectId(),
    email: "test@example.com",
    password: "hashed",
    firstName: "",
    lastName: "",
    avatar: "",
    theme: 0,
    configuredProfile: false,
  };
  deps.findUserByEmail = async (_email: string) => fakeUser;

  const ctx = createMockContext({
    method: "POST",
    path: "/signup",
    body: createJsonBody({ email: "test@example.com", password: "password" }),
  });
  await signUp(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email already in use" });

  deps.findUserByEmail = originalFindUserByEmail;
});
Deno.test("signUp: returns 201 on successful signup", async () => {
  deps.findUserByEmail = async (_email: string) => undefined;
  const fakeObjectId = new ObjectId();
  deps.insertUser = async (_user: any) => fakeObjectId;

  const ctx = createMockContext({
    method: "POST",
    path: "/signup",
    headers: [["Content-Type", "application/json"]],
    body: createJsonBody({ email: "new@example.com", password: "password" }),
  });
  await signUp(ctx);
  assertEquals(ctx.response.status, 201);
  assertEquals(ctx.response.body, {
    user: { id: fakeObjectId.toString(), email: "new@example.com" },
  });
  const setCookie = ctx.response.headers.get("set-cookie");
  assert(setCookie && setCookie.includes("jwt="));

  deps.findUserByEmail = originalFindUserByEmail;
  deps.insertUser = originalInsertUser;
});

// ----------------------
// signIn Tests
// ----------------------

Deno.test("signIn: returns 400 if no body provided", async () => {
  const ctx = createMockContext({ method: "POST", path: "/signin" });
  await signIn(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "No body provided" });
});

Deno.test("signIn: returns 400 if email or password missing", async () => {
  const ctx = createMockContext({
    method: "POST",
    path: "/signin",
    body: createJsonBody({ email: "test@example.com" }),
  });
  await signIn(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email and password required" });
});

Deno.test("signIn: returns 400 if email not found", async () => {
  deps.findUserByEmail = async (_email: string) => undefined;

  const ctx = createMockContext({
    method: "POST",
    path: "/signin",
    body: createJsonBody({
      email: "nonexistent@example.com",
      password: "password",
    }),
  });
  await signIn(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email not found" });

  deps.findUserByEmail = originalFindUserByEmail;
});

Deno.test("signIn: returns 400 if password is incorrect", async () => {
  const fakeUser = {
    _id: new ObjectId(),
    email: "test@example.com",
    password: "hashedpassword",
    firstName: "",
    lastName: "",
    avatar: "",
    theme: 0,
    configuredProfile: false,
  };
  deps.findUserByEmail = async (_email: string) => fakeUser;
  deps.compare = async (_plain: string, _hash: string) => false;

  const ctx = createMockContext({
    method: "POST",
    path: "/signin",
    body: createJsonBody({
      email: "test@example.com",
      password: "wrongpassword",
    }),
  });
  await signIn(ctx);
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Incorrect password" });

  deps.findUserByEmail = originalFindUserByEmail;
  deps.compare = originalCompare;
});

Deno.test("signIn: returns 200 on successful login", async () => {
  const fakeUser = {
    _id: new ObjectId(),
    email: "test@example.com",
    password: "hashedpassword",
    firstName: "John",
    lastName: "Doe",
    avatar: "avatar.png",
    theme: 1,
    configuredProfile: true,
  };
  deps.findUserByEmail = async (_email: string) => fakeUser;
  deps.compare = async (_plain: string, _hash: string) => true;

  const ctx = createMockContext({
    method: "POST",
    path: "/signin",
    headers: [["Content-Type", "application/json"]],
    body: createJsonBody({ email: "test@example.com", password: "password" }),
  });
  await signIn(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, {
    user: {
      id: fakeUser._id.toString(),
      email: fakeUser.email,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      avatar: fakeUser.avatar,
      theme: fakeUser.theme,
      configuredProfile: fakeUser.configuredProfile,
    },
  });
  const setCookie = ctx.response.headers.get("set-cookie");
  assert(setCookie && setCookie.includes("jwt="));

  deps.findUserByEmail = originalFindUserByEmail;
  deps.compare = originalCompare;
});

// ----------------------
// fetchUserInfo Tests
// ----------------------

Deno.test(
  "fetchUserInfo: returns 401 if user is not authenticated",
  async () => {
    const ctx = createMockContext({ method: "GET", path: "/user" });
    await fetchUserInfo(ctx);
    assertEquals(ctx.response.status, 401);
    assertEquals(ctx.response.body, { error: "User not authenticated" });
  }
);

Deno.test("fetchUserInfo: returns 404 if user not found", async () => {
  deps.findUserById = async (_id: string) => undefined;

  const ctx = createMockContext({
    method: "GET",
    path: "/user",
    state: { userId: "someId" },
  });
  await fetchUserInfo(ctx);
  assertEquals(ctx.response.status, 404);
  assertEquals(ctx.response.body, { error: "User not found" });

  deps.findUserById = originalFindUserById;
});

Deno.test("fetchUserInfo: returns 200 with user data", async () => {
  const fakeObjectId = new ObjectId();
  const fakeUser = {
    _id: fakeObjectId,
    email: "test@example.com",
    password: "somepassword", 
    firstName: "John",
    lastName: "Doe",
    avatar: "avatar.png",
    theme: 1,
    configuredProfile: true,
  };
  deps.findUserById = async (_id: string) => fakeUser;

  const ctx = createMockContext({
    method: "GET",
    path: "/user",
    state: { userId: fakeObjectId.toString() },
  });
  await fetchUserInfo(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, {
    user: {
      id: fakeObjectId.toString(),
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      avatar: "avatar.png",
      theme: 1,
      configuredProfile: true,
    },
  });

  deps.findUserById = originalFindUserById;
});

// ----------------------
// signOut Tests
// ----------------------

Deno.test("signOut: clears JWT cookie and returns 200", async () => {
  const ctx = createMockContext({ method: "POST", path: "/signout" });
  // Pre-set a JWT cookie.
  await ctx.cookies.set("jwt", "sometoken", { httpOnly: true });
  await signOut(ctx);
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, { message: "Sign out successful" });
  const jwtCookie = await ctx.cookies.get("jwt");
  assertEquals(jwtCookie, undefined);
});
