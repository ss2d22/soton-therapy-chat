import { testing } from "https://deno.land/x/oak/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {router} from "../src/server.ts"; 

Deno.test("GET / should return the expected response", async () => {
  const ctx = testing.createMockContext({
    path: "/",
    method: "GET",
  });

  await router.routes()(ctx, async () => {});

  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, "Server for soton therapy chat app");
});

