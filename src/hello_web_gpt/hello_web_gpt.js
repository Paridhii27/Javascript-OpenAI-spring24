import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

import { Chalk } from "npm:chalk@5";

const chalk = new Chalk({ level: 1 });

const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  const playerName = ctx.request.url.searchParams.get("name");
  const playerLocation = ctx.request.url.searchParams.get("location");
  const limerickPrompt = `My name is ${playerName} and I am from ${playerLocation}. Create a limerick about me.`;
  const result = await gptPrompt(limerickPrompt, { temperature: 0.7 });
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
