import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"; //library import
import { createExitSignal } from "../shared/server.ts";

const app = new Application(); //new app instance
const router = new Router(); //new router instance

// API routes
router.get("/api/gpt", (ctx) => {
  ctx.response.body = "Hello World!"; // if this route is requested send this response
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8000"); //which port to listen to

await app.listen({ port: 8000, signal: createExitSignal() }); // when to stop listening on the port
